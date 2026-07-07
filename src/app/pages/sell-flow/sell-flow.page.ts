import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService, type OrderItem, type SellInspection } from '../../services/app-state.service';

type Stage = 'brands' | 'models' | 'variants' | 'details' | 'evaluate' | 'checkout' | 'value';

@Component({
    selector: 'app-sell-flow',
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule],
    templateUrl: './sell-flow.page.html',
    styleUrls: ['./sell-flow.page.scss'],
})
export class SellFlowPage implements OnInit {
    stage: Stage = 'brands';
    categorySlug = '';
    brandSlug = '';
    modelSlug = '';
    variantSlug = '';
    inspection: any = {
        calls: true,
        touch: true,
        camera: true,
        charger: true,
        box: false,
        defects: [],
    };

    buyer = { name: '', phone: '', address: '', pincode: '', pickup: '' };
    finalOffer = 0;

    constructor(private route: ActivatedRoute, private router: Router, public state: AppStateService) { }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.categorySlug = params['category'] ?? '';
            this.brandSlug = params['brand'] ?? '';
            this.modelSlug = params['model'] ?? '';
            this.variantSlug = params['variant'] ?? '';
            this.stage = this.resolveStage();
            this.recalculate();
        });
    }

    get category() {
        return this.state.categories.find((item) => item.slug === this.categorySlug);
    }

    get brands() {
        return this.state.getBrandsForCategory(this.categorySlug);
    }

    get models() {
        return this.state.getModels(this.categorySlug, this.brandSlug);
    }

    get model() {
        return this.state.getModel(this.categorySlug, this.brandSlug, this.modelSlug);
    }

    get variant() {
        return this.state.getVariant(this.categorySlug, this.brandSlug, this.modelSlug, this.variantSlug);
    }

    get availablePrice(): number {
        return this.state.calculateOffer(this.variant?.basePrice ?? this.model?.basePrice ?? 0, this.inspection);
    }

    private resolveStage(): Stage {
        if (this.router.url.endsWith('/value')) return 'value';
        if (this.router.url.endsWith('/checkout')) return 'checkout';
        if (this.router.url.endsWith('/evaluate')) return 'evaluate';
        if (this.variantSlug) return 'details';
        if (this.modelSlug) return 'variants';
        if (this.brandSlug) return 'models';
        return 'brands';
    }

    go(path: string): void {
        this.router.navigateByUrl(path);
    }

    recalculate(): void {
        this.finalOffer = this.availablePrice;
    }

    toggleDefect(defect: string, checked: boolean): void {
        this.inspection.defects = checked
            ? [...this.inspection.defects, defect]
            : this.inspection.defects.filter((item: string) => item !== defect);
        this.recalculate();
    }

    saveOffer(): void {
        this.router.navigate(['checkout'], { relativeTo: this.route });
    }

    confirmOrder(): void {
        const order: Omit<OrderItem, 'id' | 'createdAt' | 'status'> = {
            device: `${this.model?.name ?? 'Device'} ${this.variant?.label ?? ''}`.trim(),
            category: this.category?.label ?? this.categorySlug,
            brand: this.brandSlug,
            model: this.modelSlug,
            variant: this.variantSlug,
            offer: this.finalOffer,
        };

        this.state.saveOrder(order);
        this.router.navigateByUrl('/orders');
    }

    get stepLabel(): string {
        return this.stage === 'brands' ? 'Select category brand' : this.stage === 'models' ? 'Choose a model' : this.stage === 'variants' ? 'Pick a storage/variant' : this.stage === 'details' ? 'Review details' : this.stage === 'evaluate' ? 'Inspect condition' : this.stage === 'checkout' ? 'Checkout' : 'Final value';
    }
}
