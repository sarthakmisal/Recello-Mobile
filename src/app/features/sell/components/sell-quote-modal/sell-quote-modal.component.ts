import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CatalogService } from '../../../../core/services/catalog.service';
import { SellService } from '../../../../core/services/sell.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Brand, DeviceModel, SellOption, SellQuestion, Variant } from '../../../../core/models/catalog.models';
import { Address, Listing, PriceCalculation } from '../../../../core/models/sell-flow.models';
import { QuestionFlow } from '../../../../core/utils/question-flow';
import { LoginModalComponent } from '../../../../core/components/login-modal/login-modal.component';

type Step =
  | 'brand' | 'model' | 'variant' | 'estimate'
  | 'questions' | 'final' | 'pickup' | 'new-address' | 'success';

/** Fixed category slug for this flow — every listing created here is a phone. */
const CATEGORY_SLUG = 'sell-mobiles';

interface PickupDate {
  date: string;   // yyyy-mm-dd
  label: string;  // e.g. "Today", "Tomorrow", "Wed, 16 Jul"
}

interface TimeWindow {
  start: string; // "10:00"
  end: string;   // "13:00"
  label: string; // "10 AM - 1 PM"
}

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

  // questions
  private flow: QuestionFlow | null = null;
  /** Flat list of every question for this model — needed to compute the price later. */
  private questionList: SellQuestion[] = [];
  currentQuestion: SellQuestion | null = null;
  selectedOptionIds: number[] = [];

  // price + listing
  priceCalc: PriceCalculation | null = null;
  listing: Listing | null = null;

  // pickup
  addresses: Address[] = [];
  selectedAddress: Address | null = null;
  dates: PickupDate[] = [];
  selectedDate: PickupDate | null = null;
  timeWindows: TimeWindow[] = [
    { start: '10:00', end: '13:00', label: '10 AM – 1 PM' },
    { start: '14:00', end: '17:00', label: '2 PM – 5 PM' },
    { start: '17:00', end: '20:00', label: '5 PM – 8 PM' }
  ];
  selectedWindow: TimeWindow | null = null;
  pickupNotes = '';

  newAddress = { name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', country: 'India', is_default: false };

  constructor(
    private modalCtrl: ModalController,
    private catalog: CatalogService,
    private sell: SellService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.dates = this.buildDates();
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
      next: (detail) => { this.variants = detail.variants; this.loading = false; },
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

  /* ── Questions ──────────────────────────────────────────────── */
  startQuestions(): void {
    if (!this.selectedModel) return;
    this.loading = true;
    this.errorMsg = null;
    this.sell.getQuestionsByModel(this.selectedModel.slug).subscribe({
      next: (questions) => {
        this.loading = false;
        this.questionList = questions;
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
    if (this.currentQuestion.que_type === 'single_select' || this.currentQuestion.que_type === 'yes_no') {
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
    if (!this.selectedVariant) return;
    this.errorMsg = null;
    // There is no calculate-price endpoint — the deduction % on each chosen
    // option is applied to the variant's base price right here.
    this.priceCalc = this.sell.computePrice(
      this.selectedVariant.base_price,
      this.questionList,
      this.flow?.getAnswers() ?? []
    );
    this.step = 'final';
  }

  /* ── Listing + pickup ───────────────────────────────────────── */
  proceedToPickup(): void {
    if (!this.selectedBrand || !this.selectedModel || !this.selectedVariant || !this.priceCalc) return;
    this.loading = true;
    this.errorMsg = null;
    this.sell.createListing({
      category_slug: CATEGORY_SLUG,
      brand_slug: this.selectedBrand.slug,
      model_slug: this.selectedModel.slug,
      config_id: Number(this.selectedVariant.id),
      answers: this.flow?.getAnswers() ?? [],
      expected_price: this.priceCalc.finalPrice
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
        this.selectedAddress = list.find((a) => a.is_default) ?? list[0] ?? null;
        this.loading = false;
      },
      error: () => { this.loading = false; this.addresses = []; }
    });
  }

  selectAddress(addr: Address): void {
    this.selectedAddress = addr;
  }

  selectDate(date: PickupDate): void {
    this.selectedDate = date;
  }

  selectWindow(win: TimeWindow): void {
    this.selectedWindow = win;
  }

  openNewAddress(): void {
    this.newAddress = { name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', country: 'India', is_default: this.addresses.length === 0 };
    this.step = 'new-address';
  }

  saveNewAddress(): void {
    const a = this.newAddress;
    if (!a.name || !a.phone || !a.line1 || !a.city || !a.state || !a.pincode) {
      this.errorMsg = 'Fill in name, phone, address line, city, state and pincode.'; return;
    }
    this.loading = true;
    this.errorMsg = null;
    this.sell.addAddress({
      name: a.name.trim(),
      phone: a.phone.trim(),
      line1: a.line1.trim(),
      line2: a.line2?.trim() || undefined,
      city: a.city.trim(),
      state: a.state.trim(),
      pincode: a.pincode.trim(),
      country: a.country?.trim() || 'India',
      is_default: a.is_default
    }).subscribe({
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
    if (!this.listing || !this.selectedAddress || !this.selectedDate || !this.selectedWindow) {
      this.errorMsg = 'Pick an address, date and time slot to continue.'; return;
    }
    this.loading = true;
    this.errorMsg = null;
    this.sell.schedulePickup({
      listing_id: this.listing.id,
      address_id: this.selectedAddress.id,
      pickup_date: this.selectedDate.date,
      pickup_slot_start: this.selectedWindow.start,
      pickup_slot_end: this.selectedWindow.end,
      notes: this.pickupNotes.trim() || undefined
    }).subscribe({
      next: () => { this.loading = false; this.step = 'success'; },
      error: () => { this.loading = false; this.errorMsg = 'Could not schedule pickup. Try again.'; }
    });
  }

  private buildDates(): PickupDate[] {
    const names = ['Today', 'Tomorrow'];
    const out: PickupDate[] = [];
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
