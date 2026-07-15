import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CatalogService } from '../../../../core/services/catalog.service';
import { SellService } from '../../../../core/services/sell.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Brand, DeviceModel, SellOption, SellQuestion, Variant } from '../../../../core/models/catalog.models';
import { Address, Listing, PickupSlot, PriceCalculation } from '../../../../core/models/sell-flow.models';
import { QuestionFlow } from '../../../../core/utils/question-flow';
import { LoginModalComponent } from '../../../../core/components/login-modal/login-modal.component';

type Step =
  | 'brand' | 'model' | 'variant' | 'estimate'
  | 'login-phone' | 'login-otp'
  | 'questions' | 'final' | 'pickup' | 'new-address' | 'success';

@Component({
  selector: 'rc-sell-quote-modal',
  templateUrl: './sell-quote-modal.component.html',
  styleUrls: ['./sell-quote-modal.component.scss'],
  standalone: false
})
export class SellQuoteModalComponent implements OnInit {
  @Input() initialBrandSlug?: string;

  step: Step = 'brand';
  loading = false;
  errorMsg: string | null = null;
  toastMsg = '';
  toastVisible = false;

  // catalog selection
  brands: Brand[] = [];
  brandQuery = '';
  selectedBrand: Brand | null = null;

  models: DeviceModel[] = [];
  modelQuery = '';
  selectedModel: DeviceModel | null = null;

  variants: Variant[] = [];
  selectedVariant: Variant | null = null;

  // auth
  phone = '';
  otp = '';
  requestId: string | null = null;

  // questions
  private flow: QuestionFlow | null = null;
  currentQuestion: SellQuestion | null = null;
  selectedOptionIds: number[] = [];

  // price + listing
  priceCalc: PriceCalculation | null = null;
  listing: Listing | null = null;

  // pickup
  addresses: Address[] = [];
  selectedAddress: Address | null = null;
  slots: PickupSlot[] = [];
  selectedSlot: PickupSlot | null = null;
  newAddress = { line1: '', city: '', pincode: '', phone: '' };

  constructor(
    private modalCtrl: ModalController,
    private catalog: CatalogService,
    private sell: SellService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.slots = this.buildSlots();
    if (this.initialBrandSlug) {
      this.loading = true;
      this.catalog.getBrands().subscribe({
        next: (list) => {
          this.brands = list;
          const brand = list.find((b) => b.slug === this.initialBrandSlug);
          this.loading = false;
          if (brand) this.selectBrand(brand); else this.step = 'brand';
        },
        error: () => { this.loading = false; this.errorMsg = 'Could not load brands.'; }
      });
    } else {
      this.loadBrands();
    }
  }

  dismiss(): void {
    this.modalCtrl.dismiss();
  }

  get showBack(): boolean {
    return !['brand', 'success', 'final'].includes(this.step);
  }

  goBack(): void {
    this.errorMsg = null;
    switch (this.step) {
      case 'model': this.step = 'brand'; break;
      case 'variant': this.step = 'model'; break;
      case 'estimate': this.step = 'variant'; break;
      case 'login-phone': this.step = 'estimate'; break;
      case 'login-otp': this.step = 'login-phone'; break;
      case 'questions': this.backQuestion(); break;
      case 'pickup': this.step = 'final'; break;
      case 'new-address': this.step = 'pickup'; break;
    }
  }

  get progressPct(): number {
    if (this.step !== 'questions' || !this.flow) return 0;
    return Math.round(((this.flow.position - 1) / this.flow.total) * 100);
  }

  flowTotal(): number { return this.flow?.total ?? 0; }
  flowPosition(): number { return this.flow?.position ?? 0; }

  /* ── Step 1: Brand ──────────────────────────────────────────── */
  loadBrands(): void {
    this.loading = true;
    this.errorMsg = null;
    this.catalog.getBrands().subscribe({
      next: (list) => { this.brands = list; this.loading = false; },
      error: () => { this.loading = false; this.errorMsg = 'Could not load brands. Pull to retry.'; }
    });
  }

  get filteredBrands(): Brand[] {
    const q = this.brandQuery.trim().toLowerCase();
    if (!q) return this.brands;
    return this.brands.filter((b) => b.name.toLowerCase().includes(q));
  }

  selectBrand(brand: Brand): void {
    this.selectedBrand = brand;
    this.selectedModel = null;
    this.step = 'model';
    this.loadModels();
  }

  /* ── Step 2: Model ──────────────────────────────────────────── */
  loadModels(): void {
    if (!this.selectedBrand) return;
    this.loading = true;
    this.errorMsg = null;
    this.catalog.getModels(this.selectedBrand.slug).subscribe({
      next: (list) => { this.models = list; this.loading = false; },
      error: () => { this.loading = false; this.errorMsg = 'Could not load models.'; }
    });
  }

  get filteredModels(): DeviceModel[] {
    const q = this.modelQuery.trim().toLowerCase();
    if (!q) return this.models;
    return this.models.filter((m) => m.name.toLowerCase().includes(q));
  }

  selectModel(model: DeviceModel): void {
    this.selectedModel = model;
    this.step = 'variant';
    this.loadVariants();
  }

  /* ── Step 3: Variant ────────────────────────────────────────── */
  loadVariants(): void {
    if (!this.selectedBrand || !this.selectedModel) return;
    this.loading = true;
    this.errorMsg = null;
    this.catalog.getModelDetail(this.selectedBrand.slug, this.selectedModel.slug).subscribe({
      next: (detail) => { this.variants = detail.variants; console.log(detail); this.loading = false; },
      error: () => { this.loading = false; this.errorMsg = 'Could not load storage variants.'; }
    });
  }

  selectVariant(variant: Variant): void {
    this.selectedVariant = variant;
    this.step = 'estimate';
  }

  /* ── Step 4: Estimate → gate on login ──────────────────────── */
  async getExactPrice(): Promise<void> {
    await this.auth.restore();
    if (this.auth.isLoggedIn()) { this.startQuestions(); return; }
    const modal = await this.modalCtrl.create({ component: LoginModalComponent });
    await modal.present();
    const res = await modal.onWillDismiss();
    if (res?.data?.success) this.startQuestions();
  }

  /* ── Login ──────────────────────────────────────────────────── */

  sendOtp(): void {
    if (this.phone.trim().length < 10) { this.errorMsg = 'Enter a valid 10-digit phone number.'; return; }
    this.loading = true; this.errorMsg = null;
    this.auth.requestOtp(this.phone.trim()).subscribe({
      next: (r) => { this.requestId = r.id; this.loading = false; this.step = 'login-otp'; },
      error: () => { this.loading = false; this.errorMsg = 'Could not send OTP. Try again.'; }
    });
  }

  resendOtp(): void {
    if (!this.requestId) { this.showToast('No request to resend'); return; }
    this.auth.resendOtp(this.requestId, this.phone.trim()).subscribe({ next: (r) => { this.requestId = r.id; this.showToast('OTP resent'); } });
  }

  verifyOtp(): void {
    if (!this.requestId) { this.errorMsg = 'No OTP request found.'; return; }
    if (this.otp.trim().length < 4) { this.errorMsg = 'Enter the OTP you received.'; return; }
    this.loading = true; this.errorMsg = null;
    this.auth.verifyOtp(this.requestId, this.otp.trim()).subscribe({
      next: () => { this.loading = false; this.startQuestions(); },
      error: () => { this.loading = false; this.errorMsg = 'Incorrect OTP. Try again.'; }
    });
  }

  /* ── Questions ──────────────────────────────────────────────── */
  startQuestions(): void {
    if (!this.selectedModel) return;
    this.loading = true;
    this.errorMsg = null;
    this.sell.getQuestionsByModel(this.selectedModel.slug).subscribe({
      next: (questions) => {
        this.loading = false;
        if (!questions.length) { this.finishQuestions(); return; }
        this.flow = new QuestionFlow(questions);
        this.step = 'questions';
        this.loadCurrentQuestion();
      },
      error: () => { this.loading = false; this.errorMsg = 'Could not load condition questions.'; }
    });
  }

  private loadCurrentQuestion(): void {
    this.currentQuestion = this.flow?.current() ?? null;
    this.selectedOptionIds = this.currentQuestion ? [...(this.flow?.answerFor(this.currentQuestion.id) ?? [])] : [];
  }

  isOptionSelected(opt: SellOption): boolean {
    return this.selectedOptionIds.includes(opt.id);
  }

  chooseOption(opt: SellOption): void {
    if (!this.currentQuestion) return;
    if (this.currentQuestion.que_type === 'single_select') {
      this.selectedOptionIds = [opt.id];
      this.submitAnswer();
    } else {
      const i = this.selectedOptionIds.indexOf(opt.id);
      if (i >= 0) this.selectedOptionIds.splice(i, 1); else this.selectedOptionIds.push(opt.id);
    }
  }

  submitAnswer(): void {
    if (!this.flow) return;
    this.flow.answer(this.selectedOptionIds);
    if (this.flow.isFinished) this.finishQuestions(); else this.loadCurrentQuestion();
  }

  backQuestion(): void {
    if (!this.flow) return;
    if (this.flow.canGoBack()) { this.flow.back(); this.loadCurrentQuestion(); }
    else { this.step = 'estimate'; }
  }

  /* ── Final price ────────────────────────────────────────────── */
  private finishQuestions(): void {
    if (!this.selectedModel || !this.selectedVariant) return;
    this.loading = true;
    this.errorMsg = null;
    this.sell.calculatePrice({
      model_slug: this.selectedModel.slug,
      variant_id: this.selectedVariant.id,
      answers: this.flow?.getAnswers() ?? []
    }).subscribe({
      next: (calc) => { this.priceCalc = calc; this.loading = false; this.step = 'final'; },
      error: () => { this.loading = false; this.errorMsg = 'Could not calculate the final price.'; }
    });
  }

  /* ── Listing + pickup ───────────────────────────────────────── */
  proceedToPickup(): void {
    if (!this.selectedBrand || !this.selectedModel || !this.selectedVariant || !this.priceCalc) return;
    this.loading = true;
    this.errorMsg = null;
    this.sell.createListing({
      model_slug: this.selectedModel.slug,
      variant_id: this.selectedVariant.id,
      brand: this.selectedBrand.name,
      model: this.selectedModel.name,
      variant: this.selectedVariant.name,
      base_price: this.priceCalc.basePrice,
      final_price: this.priceCalc.finalPrice,
      answers: this.flow?.getAnswers() ?? []
    }).subscribe({
      next: (listing) => { this.listing = listing; this.loading = false; this.step = 'pickup'; this.loadAddresses(); },
      error: () => { this.loading = false; this.errorMsg = 'Could not create your listing.'; }
    });
  }

  loadAddresses(): void {
    this.loading = true;
    this.sell.getAddresses().subscribe({
      next: (list) => {
        this.addresses = list;
        this.selectedAddress = list.find((a) => a.isDefault) ?? list[0] ?? null;
        this.loading = false;
      },
      error: () => { this.loading = false; this.addresses = []; }
    });
  }

  selectAddress(addr: Address): void {
    this.selectedAddress = addr;
  }

  selectSlot(slot: PickupSlot): void {
    this.selectedSlot = slot;
  }

  openNewAddress(): void {
    this.newAddress = { line1: '', city: '', pincode: '', phone: '' };
    this.step = 'new-address';
  }

  saveNewAddress(): void {
    if (!this.newAddress.line1 || !this.newAddress.city || !this.newAddress.pincode) {
      this.errorMsg = 'Fill in address line, city and pincode.'; return;
    }
    this.loading = true;
    this.errorMsg = null;
    this.sell.addAddress(this.newAddress).subscribe({
      next: (addr) => {
        this.addresses = [addr, ...this.addresses];
        this.selectedAddress = addr;
        this.loading = false;
        this.step = 'pickup';
      },
      error: () => { this.loading = false; this.errorMsg = 'Could not save address.'; }
    });
  }

  confirmPickup(): void {
    if (!this.listing || !this.selectedAddress || !this.selectedSlot) {
      this.errorMsg = 'Pick an address and a slot to continue.'; return;
    }
    this.loading = true;
    this.errorMsg = null;
    this.sell.schedulePickup({
      listing_id: this.listing._id,
      address_id: this.selectedAddress.id,
      pickup_date: this.selectedSlot.date,
      pickup_slot: this.selectedSlot.label
    }).subscribe({
      next: () => { this.loading = false; this.step = 'success'; },
      error: () => { this.loading = false; this.errorMsg = 'Could not schedule pickup. Try again.'; }
    });
  }

  private buildSlots(): PickupSlot[] {
    const names = ['Today', 'Tomorrow'];
    const out: PickupSlot[] = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const label = names[i] ?? d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      out.push({ date: d.toISOString().slice(0, 10), label });
    }
    return out;
  }

  private showToast(msg: string): void {
    this.toastMsg = msg;
    this.toastVisible = true;
    setTimeout(() => (this.toastVisible = false), 2200);
  }
}
