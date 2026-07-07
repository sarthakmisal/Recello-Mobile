import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.page.html',
  styleUrls: ['./partner.page.scss'],
  standalone: false,
})
export class PartnerPage {
  name = '';
  email = '';
  phone = '';
  submitting = false;
  submitted = false;

  benefits = [
    { icon: 'trending-up-outline', title: 'Higher Payouts', desc: 'Earn up to 20% more per device sold through our platform.', color: '#4F7EFF' },
    { icon: 'flash-outline', title: 'Instant Transfers', desc: 'Same-day payment for all approved devices.', color: '#00D2B8' },
    { icon: 'headset-outline', title: 'Dedicated Support', desc: 'Priority account manager for all partner queries.', color: '#FFB547' },
    { icon: 'shield-checkmark-outline', title: 'Bulk Processing', desc: 'Special rates for bulk device submissions.', color: '#7B5EA7' },
  ];

  constructor(private navCtrl: NavController) { }

  submit() {
    if (!this.name || !this.email || !this.phone) return;
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.submitted = true;
    }, 1200);
  }

  back() {
    this.navCtrl.back();
  }
}
