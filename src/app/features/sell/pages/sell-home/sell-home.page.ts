import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CatalogService } from '../../../../core/services/catalog.service';
import { Brand } from '../../../../core/models/catalog.models';
import { SellQuoteModalComponent } from '../../components/sell-quote-modal/sell-quote-modal.component';

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
    const modal = await this.modalCtrl.create({
      component: SellQuoteModalComponent,
      componentProps: { initialBrandSlug: brandSlug },
      breakpoints: [0, 0.92],
      initialBreakpoint: 0.92,
      handle: false
    });
    await modal.present();
  }
}
