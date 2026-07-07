import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

interface Brand { name: string; basePrice: number; }
interface Condition { key: string; label: string; desc: string; mult: number; }

@Component({
  selector: 'app-sell-mobiles',
  templateUrl: './sell-mobiles.page.html',
  styleUrls: ['./sell-mobiles.page.scss'],
  standalone: false,
})
export class SellMobilesPage {
  search = '';
  selectedBrand: Brand | null = null;
  selectedCondition: string | null = null;

  brands: Brand[] = [
    { name: 'Apple', basePrice: 45000 },
    { name: 'Samsung', basePrice: 32000 },
    { name: 'OnePlus', basePrice: 28000 },
    { name: 'Xiaomi', basePrice: 18000 },
    { name: 'Google', basePrice: 35000 },
    { name: 'Nothing', basePrice: 22000 },
    { name: 'Realme', basePrice: 14000 },
    { name: 'Vivo', basePrice: 15000 },
    { name: 'Oppo', basePrice: 16000 },
    { name: 'Motorola', basePrice: 13000 },
    { name: 'Nokia', basePrice: 10000 },
    { name: 'Sony', basePrice: 30000 },
  ];

  conditions: Condition[] = [
    { key: 'Excellent', label: 'Excellent', desc: 'Like new, no scratches or dents', mult: 0.9 },
    { key: 'Good', label: 'Good', desc: 'Minor wear, fully functional', mult: 0.75 },
    { key: 'Fair', label: 'Fair', desc: 'Noticeable wear, all functions work', mult: 0.55 },
    { key: 'Poor', label: 'Poor', desc: 'Heavy wear, may have issues', mult: 0.3 },
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
