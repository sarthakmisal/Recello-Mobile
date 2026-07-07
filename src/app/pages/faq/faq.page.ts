import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

interface FaqItem { q: string; a: string; }
interface FaqSection { title: string; icon: string; color: string; items: FaqItem[]; }

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: false,
})
export class FaqPage {
  expandedKey: string | null = null;

  sections: FaqSection[] = [
    {
      title: 'Getting Started',
      icon: 'rocket-outline',
      color: '#4F7EFF',
      items: [
        { q: 'How do I sell my device on Recello?', a: 'Choose your device category, select the brand and model, describe the condition, and get an instant quote. We\'ll arrange a free pickup once you confirm.' },
        { q: 'Which devices does Recello accept?', a: 'We accept smartphones, tablets, and laptops from all major brands. Devices must power on and not be blacklisted or reported stolen.' },
        { q: 'Is there a minimum device value?', a: 'Yes, we accept devices with a minimum resale value of ₹1,000. Devices below this threshold may not be eligible.' },
      ],
    },
    {
      title: 'Payments & Pricing',
      icon: 'cash-outline',
      color: '#00D2B8',
      items: [
        { q: 'How is the quote calculated?', a: 'Our algorithm considers the brand, model, age, storage, and condition of your device based on real-time market data.' },
        { q: 'When will I get paid?', a: 'Payment is processed within 24 hours of our team verifying your device after pickup. UPI and bank transfer are both available.' },
        { q: 'Can the quote change after pickup?', a: 'The quoted price is guaranteed if the device condition matches your description. If there\'s a discrepancy, our team will contact you with a revised offer before proceeding.' },
      ],
    },
    {
      title: 'Pickup & Logistics',
      icon: 'cube-outline',
      color: '#FFB547',
      items: [
        { q: 'Is pickup really free?', a: 'Yes, doorstep pickup is completely free across all major Indian cities. No hidden charges whatsoever.' },
        { q: 'How long does pickup take?', a: 'We schedule pickup within 24–48 hours of confirming your order, depending on your location and availability.' },
        { q: 'What if I want to cancel?', a: 'You can cancel any time before the pickup agent arrives. Simply go to My Orders and tap Cancel. No penalties apply.' },
      ],
    },
  ];

  constructor(private navCtrl: NavController) { }

  toggle(key: string) {
    this.expandedKey = this.expandedKey === key ? null : key;
  }

  isExpanded(key: string): boolean {
    return this.expandedKey === key;
  }

  back() {
    this.navCtrl.back();
  }
}
