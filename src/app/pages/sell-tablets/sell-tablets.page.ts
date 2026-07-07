import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

interface Brand { name: string; basePrice: number; }
interface Condition { key: string; label: string; desc: string; mult: number; }

@Component({
  selector: 'app-sell-tablets',
  templateUrl: './sell-tablets.page.html',
  styleUrls: ['./sell-tablets.page.scss'],
  standalone: false,
})
export class SellTabletsPage {
  search = '';
  selectedBrand: Brand | null = null;
  selectedCondition: string | null = null;

  brands: Brand[] = [
    { name: 'Apple iPad', basePrice: 52000 },
    { name: 'Samsung Tab', basePrice: 38000 },
    { name: 'Xiaomi Pad', basePrice: 24000 },
    { name: 'Lenovo Tab', basePrice: 22000 },
    { name: 'Realme Pad', basePrice: 18000 },
    { name: 'OnePlus Pad', basePrice: 35000 },
    { name: 'Nokia Tab', basePrice: 16000 },
    { name: 'Huawei Tab', basePrice: 28000 },
    { name: 'Amazon Fire', basePrice: 12000 },
  ];

  conditions: Condition[] = [
    { key: 'Excellent', label: 'Excellent', desc: 'Like new, screen pristine', mult: 0.88 },
    { key: 'Good', label: 'Good', desc: 'Minor wear, fully functional', mult: 0.72 },
    { key: 'Fair', label: 'Fair', desc: 'Visible wear, works fine', mult: 0.52 },
    { key: 'Poor', label: 'Poor', desc: 'Heavy wear or minor issues', mult: 0.28 },
  ];

  constructor(private navCtrl: NavController) { }

  get filteredBrands(): Brand[] {
    const q = this.search.toLowerCase();
    return q ? this.brands.filter((b) => b.name.toLowerCase().includes(q)) : this.brands;
  }

  get quote(): number | null {
    if (!this.selectedBrand || !this.selectedCondition) return null;
    const cond = this.conditions.find((c) => c.key === this.selectedCondition);
    return cond ? Math.round(this.selectedBrand.basePrice * cond.mult) : null;
  }

  selectBrand(b: Brand) {
    this.selectedBrand = b;
    this.selectedCondition = null;
  }

  selectCondition(key: string) {
    this.selectedCondition = key;
  }

  formatPrice(n: number): string {
    return '₹' + n.toLocaleString('en-IN');
  }

  back() {
    this.navCtrl.back();
  }
}
