import { Component, OnInit } from '@angular/core'
import { CatalogService } from 'src/app/core/services/catalog.service'
import { SellQuoteModalComponent } from '../../components/sell-quote-modal/sell-quote-modal.component'
import { ModalController } from '@ionic/angular'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'app-quick-sell',
    templateUrl: './quick-sell.page.html',
    styleUrls: ['./quick-sell.page.scss'],
    standalone: false
})
export class QuickSellPage implements OnInit {
    quickSellItems: any[] = []
    loading = true
    error = ''
    baseUrl = `${environment.apiUrl}/uploads/`

    constructor(private catalogService: CatalogService, private modalCtrl: ModalController) { }

    async ngOnInit() {
        await this.loadQuickSell()
    }

    async loadQuickSell() {
        try {
            this.loading = true
            this.error = ''
            this.quickSellItems = await this.catalogService.getQuickSell()
        } catch (err) {
            console.error(err)
            this.error = 'Failed to load quick sell items'
        } finally {
            this.loading = false
        }
    }

    /** Builds a full image URL from either `image_url` or the model's `model_url`. */
    quickSellImageUrl(item: any): string {
        const image = item?.image_url || item?.model_url || ''
        if (!image) return 'assets/placeholder.png'
        return image.startsWith('http') ? image : `${this.baseUrl}${image}`
    }

    async openQuickSellQuote(item: any) {
        // The quick-sell API gives us brand_slug/model_slug (not brand_id/model_id),
        // so match on those and hand the modal everything it needs to jump straight
        // to the variant step.
        if (!item?.brand_slug || !item?.model_slug) return
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
        })
        await modal.present()
    }
}
