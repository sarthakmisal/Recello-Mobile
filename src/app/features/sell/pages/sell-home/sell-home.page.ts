import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { CatalogService } from '../../../../core/services/catalog.service';
import { Brand } from '../../../../core/models/catalog.models';
import { SellQuoteModalComponent } from '../../components/sell-quote-modal/sell-quote-modal.component';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

interface FaqItem {
  question: string;
  answer: string;
}

interface ReviewItem {
  name: string;
  city: string;
  rating: number;
  text: string;
}

@Component({
  selector: 'rc-sell-home',
  templateUrl: './sell-home.page.html',
  styleUrls: ['./sell-home.page.scss'],
  standalone: false
})
export class SellHomePage implements OnInit {
  brands: Brand[] = [];
  loading = true;
  loadError = false;
  quickSellItems: any[] = [];
  protected logoUrl: string = `assets/logo/Recello_logo.png`;
  baseUrl: string = `${environment.apiUrl}/uploads/`;
  faqs: FaqItem[] = [];
  reviews: ReviewItem[] = [
    { name: 'Aarav', city: 'Pune', rating: 5, text: 'Quick pickup, transparent quote and instant payment. The process felt very easy.' },
    { name: 'Ritika', city: 'Baner', rating: 5, text: 'I sold my old iPhone in under a day. Customer support was proactive from start to finish.' },
    { name: 'Sanket', city: 'Kharadi', rating: 4, text: 'The evaluation was honest and the final amount matched what I expected after inspection.' }
  ];
  menuOpen = false;
  offerCopied = false;

  constructor(
    private catalog: CatalogService,
    private modalCtrl: ModalController,
    protected authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadBrands();
    this.loadFaqs();
    this.loadReviews();
    this.loadQuickSell();
  }

  loadBrands(): void {
    this.loading = true;
    this.loadError = false;
    this.catalog.getBrands().subscribe({
      next: (brands) => { this.brands = brands.slice(0, 8); this.loading = false; },
      error: () => { this.loading = false; this.loadError = true; }
    });
  }

  loadFaqs(): void {
    this.http.get<FaqItem[]>(`${environment.apiUrl}/api/faqs/active`).subscribe({
      next: (data) => {
        this.faqs = Array.isArray(data) && data.length ? data.slice(0, 4) : this.defaultFaqs;
      },
      error: () => {
        this.faqs = this.defaultFaqs;
      }
    });
  }

  loadReviews(): void {
    this.http.get<any[]>(`${environment.apiUrl}/api/contact_us`).subscribe({
      next: (data) => {
        const mapped = (Array.isArray(data) ? data : [])
          .slice(0, 6)
          .map((item) => ({
            name: [item.first_name, item.last_name].filter(Boolean).join(' ') || 'Customer',
            city: item.city || 'Pune',
            rating: 5,
            text: item.message || item.subject || 'Great experience with Recello.'
          }));
        this.reviews = mapped.length ? mapped : this.reviews;
      },
      error: () => {
        this.reviews = this.reviews;
      }
    });
  }

  async loadQuickSell(): Promise<void> {
    try {
      const items = await this.catalog.getQuickSell();
      this.quickSellItems = Array.isArray(items) ? items : [];
    } catch (err) {
      console.error('Failed to load quick sell:', err);
      this.quickSellItems = [];
    }
  }

  quickSellImageUrl(item: any): string {
    const image = item?.image_url || item?.model_url || '';
    if (!image) return '';
    return image.startsWith('http') ? image : `${this.baseUrl}${image}`;
  }

  async openQuote(brandSlug?: string): Promise<void> {
    this.closeMenu();
    const modal = await this.modalCtrl.create({
      component: SellQuoteModalComponent,
      componentProps: { initialBrandSlug: brandSlug },
      breakpoints: [0, 0.92],
      expandToScroll: false,
      initialBreakpoint: 0.92,
      handle: false
    });
    await modal.present();
  }

  openQuickSellPage(): void {
    this.closeMenu();
    this.router.navigateByUrl('/quick-sell');
  }

  async openQuickSellQuote(item: any): Promise<void> {
    // The quick-sell API gives us brand_slug/model_slug (not brand_id/model_id),
    // so match on those and hand the modal everything it needs to jump straight
    // to the variant step, skipping the brand/model list screens.
    if (!item?.brand_slug || !item?.model_slug) return;
    this.closeMenu();
    const modal = await this.modalCtrl.create({
      component: SellQuoteModalComponent,
      componentProps: {
        initialBrandSlug: item.brand_slug,
        initialModelSlug: item.model_slug,
        initialBrandName: item.brand_name,
        initialModelName: item.model_name,
        initialModelUrl: item.model_url
      },
      breakpoints: [0, 0.92],
      expandToScroll: false,
      initialBreakpoint: 0.92,
      handle: false
    });
    await modal.present();
  }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu(): void { this.menuOpen = false; }

  async claimOffer(): Promise<void> {
    try { await navigator.clipboard?.writeText('HELLO200'); } catch { /* clipboard unavailable */ }
    this.offerCopied = true;
    setTimeout(() => { this.offerCopied = false; }, 2400);
  }

  myRedirect(path: string): void {
    this.closeMenu();
    this.router.navigateByUrl(path);
    window.location.href = path;
  }

  private readonly defaultFaqs: FaqItem[] = [
    {
      question: 'How is my phone price calculated?',
      answer: 'The quote is based on model, storage, age, physical condition, screen, functionality, warranty and current resale demand.'
    },
    {
      question: 'Is doorstep pickup free?',
      answer: 'Yes. Recello pickup and inspection are free in our supported Pune locations.'
    },
    {
      question: 'When will I receive payment?',
      answer: 'Once the pickup expert verifies the phone and you accept the final offer, payment is released right away.'
    },
    {
      question: 'Do I need to log in to sell my phone?',
      answer: 'Yes, to protect your sessions and keep a secure record of your transaction, we require a quick login before you confirm the final pickup.'
    }
  ];
}
