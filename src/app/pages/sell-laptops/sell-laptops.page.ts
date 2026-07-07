import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

interface Brand { name: string; basePrice: number; }
interface Condition { key: string; label: string; desc: string; mult: number; }

@Component({
  selector: 'app-sell-laptops',
  templateUrl: './sell-laptops.page.html',
  styleUrls: ['./sell-laptops.page.scss'],
  standalone: false,
})
export class SellLaptopsPage {
  search = '';
  selectedBrand: Brand | null = null;
  selectedCondition: string | null = null;

  brands: Brand[] = [
    { name: 'MacBook', basePrice: 85000 },
    { name: 'Dell XPS', basePrice: 70000 },
    { name: 'HP Spectre', basePrice: 62000 },
    { name: 'Lenovo ThinkPad', basePrice: 55000 },
    { name: 'ASUS ROG', basePrice: 68000 },
    { name: 'Microsoft Surface', basePrice: 72000 },
    { name: 'Acer Swift', basePrice: 45000 },
    { name: 'MSI Laptop', basePrice: 60000 },
    { name: 'Razer Blade', basePrice: 90000 },
  ];

  conditions: Condition[] = [
    { key: 'Excellent', label: 'Excellent', desc: 'Like new, battery health >90%', mult: 0.85 },
    { key: 'Good', label: 'Good', desc: 'Minor scratches, battery >75%', mult: 0.68 },
    { key: 'Fair', label: 'Fair', desc: 'Visible wear, battery >60%', mult: 0.48 },
    { key: 'Poor', label: 'Poor', desc: 'Heavy wear, may need repairs', mult: 0.25 },
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
