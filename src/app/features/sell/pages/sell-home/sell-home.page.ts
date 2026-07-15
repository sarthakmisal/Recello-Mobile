import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CatalogService } from '../../../../core/services/catalog.service';
import { Brand } from '../../../../core/models/catalog.models';
import { SellQuoteModalComponent } from '../../components/sell-quote-modal/sell-quote-modal.component';
import { environment } from 'src/environments/environment';

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
  protected logoUrl: string = `assets/logo/Recello_logo.png`
  // --- UI-only state for the (static) marketing shell — no business logic here ---
  menuOpen = false;
  offerCopied = false;

  constructor(private catalog: CatalogService, private modalCtrl: ModalController) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.loading = true;
    this.loadError = false;
    this.catalog.getBrands().subscribe({
      next: (brands) => { this.brands = brands.slice(0, 8); this.loading = false; },
      error: () => { this.loading = false; this.loadError = true; }
    });
  }

  async openQuote(brandSlug?: string): Promise<void> {
    this.closeMenu();
    const modal = await this.modalCtrl.create({
      component: SellQuoteModalComponent,
      componentProps: { initialBrandSlug: brandSlug },
      breakpoints: [0, 0.92],
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
}
