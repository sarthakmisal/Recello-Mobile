import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CatalogService } from '../../services/catalog.service';
import { SellService, SellAnswers } from '../../services/sell.service';
import { AuthService } from '../../services/auth.service';
import {
  Service, Brand, DeviceModel, ModelConfig, SellQuestion, PriceCalculation
} from '../../models/catalog.models';

type Stage = 'brands' | 'models' | 'configs' | 'evaluate' | 'checkout' | 'confirmed';

interface EvalAnswer {
  questionId: string;
  answer: boolean | string;
}

@Component({
  selector: 'app-sell-flow',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './sell-flow.page.html',
  styleUrls: ['./sell-flow.page.scss'],
})
export class SellFlowPage implements OnInit, OnDestroy {
  stage: Stage = 'brands';

  serviceSlug = '';
  brandSlug = '';
  modelSlug = '';
  configId = '';

  service: Service | null = null;
  brands: Brand[] = [];
  models: DeviceModel[] = [];
  configs: ModelConfig[] = [];
  questions: SellQuestion[] = [];

  selectedBrand: Brand | null = null;
  selectedModel: DeviceModel | null = null;
  selectedConfig: ModelConfig | null = null;

  pricing: PriceCalculation | null = null;
  answers: EvalAnswer[] = [];

  loadingBrands = false;
  loadingModels = false;
  loadingConfigs = false;
  loadingQuestions = false;
  loadingPrice = false;
  submitting = false;

  address = { fullName: '', phone: '', line1: '', city: '', state: '', pincode: '' };
  pickupDate = '';
  pickupSlot = '';

  readonly pickupSlots = [
    '9:00 AM – 12:00 PM',
    '12:00 PM – 3:00 PM',
    '3:00 PM – 6:00 PM',
    '6:00 PM – 9:00 PM',
  ];

  private subs = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalog: CatalogService,
    private sell: SellService,
    public auth: AuthService,
    private toast: ToastController,
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.route.params.subscribe(params => {
        this.serviceSlug = params['serviceSlug'] ?? '';
        this.brandSlug = params['brandSlug'] ?? '';
        this.modelSlug = params['modelSlug'] ?? '';
        this.configId = params['configId'] ?? '';
        this.determineStage();
        this.loadForStage();
      })
    );
  }

  private determineStage(): void {
    const url = this.router.url;
    if (url.endsWith('/checkout')) { this.stage = 'checkout'; return; }
    if (this.configId)  { this.stage = 'evaluate'; return; }
    if (this.modelSlug) { this.stage = 'configs'; return; }
    if (this.brandSlug) { this.stage = 'models'; return; }
    this.stage = 'brands';
  }

  private loadForStage(): void {
    if (this.stage === 'brands') {
      this.loadBrands();
    } else if (this.stage === 'models') {
      if (!this.selectedBrand) this.loadBrands();
      this.loadModels();
    } else if (this.stage === 'configs') {
      if (!this.selectedModel) this.loadModels();
      this.loadConfigs();
    } else if (this.stage === 'evaluate') {
      if (!this.selectedConfig) this.loadConfigs();
      this.loadQuestions();
    } else if (this.stage === 'checkout') {
      // Pre-fill from auth
      if (this.auth.user) {
        this.address.fullName = this.auth.user.name ?? '';
        this.address.phone = this.auth.user.phone ?? '';
      }
    }
  }

  private loadBrands(): void {
    this.loadingBrands = true;
    this.subs.add(
      this.catalog.getServices().pipe(
        switchMap(services => {
          this.service = services.find(s => s.slug === this.serviceSlug) ?? null;
          if (!this.service) return of([]);
          return this.catalog.getBrandsForService(this.service._id);
        }),
        catchError(() => of([]))
      ).subscribe(brands => {
        this.brands = brands as Brand[];
        if (this.brandSlug) {
          this.selectedBrand = this.brands.find(b => b.slug === this.brandSlug) ?? null;
        }
        this.loadingBrands = false;
      })
    );
  }

  private loadModels(): void {
    this.loadingModels = true;
    this.subs.add(
      this.catalog.getServices().pipe(
        switchMap(services => {
          this.service = services.find(s => s.slug === this.serviceSlug) ?? null;
          const brand = this.brands.find(b => b.slug === this.brandSlug);
          this.selectedBrand = brand ?? null;
          if (!brand) return of([]);
          return this.catalog.getModelsForBrand(brand._id);
        }),
        catchError(() => of([]))
      ).subscribe(models => {
        this.models = models as DeviceModel[];
        if (this.modelSlug) {
          this.selectedModel = this.models.find(m => m.slug === this.modelSlug) ?? null;
        }
        this.loadingModels = false;
      })
    );
  }

  private loadConfigs(): void {
    this.loadingConfigs = true;
    const model = this.models.find(m => m.slug === this.modelSlug);
    if (!model) { this.loadingConfigs = false; return; }
    this.selectedModel = model;
    this.subs.add(
      this.catalog.getModelConfigs(model._id).pipe(catchError(() => of([]))).subscribe(configs => {
        this.configs = configs as ModelConfig[];
        if (this.configId) {
          this.selectedConfig = this.configs.find(c => c._id === this.configId) ?? null;
        }
        this.loadingConfigs = false;
      })
    );
  }

  private loadQuestions(): void {
    if (!this.service) {
      this.catalog.getServices().pipe(
        switchMap(services => {
          this.service = services.find(s => s.slug === this.serviceSlug) ?? null;
          return this.service ? this.sell.getQuestionsForCategory(this.service._id) : of([]);
        }),
        catchError(() => of([]))
      ).subscribe(qs => {
        this.questions = qs as SellQuestion[];
        this.initAnswers();
        this.loadingQuestions = false;
      });
      return;
    }
    this.loadingQuestions = true;
    this.subs.add(
      this.sell.getQuestionsForCategory(this.service._id).pipe(catchError(() => of([]))).subscribe(qs => {
        this.questions = qs as SellQuestion[];
        this.initAnswers();
        this.loadingQuestions = false;
      })
    );
  }

  private initAnswers(): void {
    this.answers = this.questions.map(q => ({
      questionId: q._id,
      answer: q.type === 'boolean' ? true : (q.options?.[0]?._id ?? ''),
    }));
  }

  setAnswer(qId: string, value: boolean | string): void {
    const idx = this.answers.findIndex(a => a.questionId === qId);
    if (idx >= 0) this.answers[idx].answer = value;
    else this.answers.push({ questionId: qId, answer: value });
  }

  getAnswer(qId: string): boolean | string {
    return this.answers.find(a => a.questionId === qId)?.answer ?? true;
  }

  calculatePrice(): void {
    if (!this.selectedConfig) return;
    this.loadingPrice = true;
    const payload: SellAnswers[] = this.answers.map(a => ({
      questionId: a.questionId,
      answer: a.answer as any,
    }));
    this.subs.add(
      this.sell.calculatePrice(this.selectedConfig._id, payload).pipe(catchError(() => of(null))).subscribe(result => {
        this.pricing = result as PriceCalculation | null;
        if (!this.pricing && this.selectedConfig) {
          this.pricing = { basePrice: this.selectedConfig.basePrice, finalPrice: this.selectedConfig.basePrice, deductions: [] };
        }
        this.loadingPrice = false;
      })
    );
  }

  proceedToCheckout(): void {
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.router.navigate([
      'sell', this.serviceSlug, this.brandSlug, this.modelSlug, this.configId, 'checkout'
    ]);
  }

  async submitOrder(): Promise<void> {
    if (!this.address.fullName || !this.address.phone || !this.address.line1 || !this.pickupDate || !this.pickupSlot) {
      this.showToast('Please fill in all required fields.', 'warning');
      return;
    }
    if (!this.service || !this.selectedBrand || !this.selectedModel || !this.selectedConfig) {
      this.showToast('Missing device information. Please start again.', 'danger');
      return;
    }
    this.submitting = true;
    const payload = {
      categoryId: this.service._id,
      brandId: this.selectedBrand._id,
      modelId: this.selectedModel._id,
      configId: this.selectedConfig._id,
      answers: this.answers.map(a => ({ questionId: a.questionId, answer: a.answer as any })),
      address: this.address,
      pickupDate: this.pickupDate,
      pickupSlot: this.pickupSlot,
    };
    this.subs.add(
      this.sell.createListing(payload).pipe(catchError(() => of(null))).subscribe(listing => {
        this.submitting = false;
        if (listing) {
          this.stage = 'confirmed';
        } else {
          this.showToast('Failed to create order. Please try again.', 'danger');
        }
      })
    );
  }

  selectBrand(brand: Brand): void {
    this.selectedBrand = brand;
    this.router.navigate(['sell', this.serviceSlug, brand.slug]);
  }

  selectModel(model: DeviceModel): void {
    this.selectedModel = model;
    this.router.navigate(['sell', this.serviceSlug, this.brandSlug, model.slug]);
  }

  selectConfig(config: ModelConfig): void {
    this.selectedConfig = config;
    this.router.navigate(['sell', this.serviceSlug, this.brandSlug, this.modelSlug, config._id]);
    this.loadQuestions();
    setTimeout(() => this.calculatePrice(), 600);
  }

  goBack(): void {
    const url = this.router.url;
    if (url.endsWith('/checkout')) {
      this.router.navigate(['sell', this.serviceSlug, this.brandSlug, this.modelSlug, this.configId]);
      return;
    }
    if (this.configId) { this.router.navigate(['sell', this.serviceSlug, this.brandSlug, this.modelSlug]); return; }
    if (this.modelSlug) { this.router.navigate(['sell', this.serviceSlug, this.brandSlug]); return; }
    if (this.brandSlug) { this.router.navigate(['sell', this.serviceSlug]); return; }
    this.router.navigate(['/']);
  }

  get stageTitle(): string {
    const map: Record<Stage, string> = {
      brands: `Sell ${this.service?.name ?? this.serviceSlug}`,
      models: `${this.selectedBrand?.name ?? 'Brand'} Models`,
      configs: `${this.selectedModel?.name ?? 'Model'} Variants`,
      evaluate: 'Device Condition',
      checkout: 'Pickup & Address',
      confirmed: 'Order Placed!',
    };
    return map[this.stage];
  }

  get breadcrumb(): string[] {
    const crumbs = [this.service?.name ?? this.serviceSlug];
    if (this.selectedBrand) crumbs.push(this.selectedBrand.name);
    if (this.selectedModel) crumbs.push(this.selectedModel.name);
    if (this.selectedConfig) crumbs.push(this.selectedConfig.name);
    return crumbs;
  }

  get isLoading(): boolean {
    return this.loadingBrands || this.loadingModels || this.loadingConfigs || this.loadingQuestions;
  }

  get todayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  getConfigLabel(c: ModelConfig): string {
    return [c.storage, c.ram, c.color].filter(Boolean).join(' · ');
  }

  private async showToast(message: string, color: string): Promise<void> {
    const t = await this.toast.create({ message, duration: 2500, color, position: 'bottom' });
    await t.present();
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }
}
