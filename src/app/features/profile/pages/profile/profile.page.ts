import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../../../core/services/auth.service';
import { MyProfile } from '../../../../core/models/sell-flow.models';

const STATUS_LABELS: Record<number, string> = {
  1: 'Active',
  2: 'Inactive',
  3: 'Deleted'
};

interface QuickLink { label: string; path: string; danger?: boolean; }

@Component({
  selector: 'rc-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  readonly quickLinks: QuickLink[] = [
    { label: 'My Orders', path: '/orders' },
    { label: 'About Recello', path: '/about-us' },
    { label: 'FAQs', path: '/faq' },
    { label: 'Contact Us', path: '/contact-us' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms & Conditions', path: '/terms-conditions' },
    { label: 'Request Account Deletion', path: '/account-delete', danger: true }
  ];

  loading = true;
  loadError = false;
  profile: MyProfile | null = null;

  editing = false;
  saving = false;
  saveError = '';
  saveDone = false;

  form = { first_name: '', last_name: '', phone: '' };

  constructor(private auth: AuthService, private location: Location, private navCtrl: NavController) { }

  ngOnInit(): void { this.load(); }

  goBack(): void { this.location.back(); }

  // NavController (not a raw Router.navigateByUrl) so Ionic's own router-outlet
  // transition/stack handling runs properly — navigateByUrl was leaving the outlet
  // in a blank state on some devices even though the URL itself updated correctly.
  goTo(path: string): void { this.navCtrl.navigateForward(path); }

  logout(): void { this.auth.logout(); }

  get statusLabel(): string {
    const s = this.profile?.status;
    return (s !== undefined && STATUS_LABELS[s]) || '—';
  }

  get initials(): string {
    const a = (this.profile?.first_name || '').charAt(0);
    const b = (this.profile?.last_name || '').charAt(0);
    return (a + b).toUpperCase() || 'U';
  }

  get fullName(): string {
    const name = [this.profile?.first_name, this.profile?.last_name].filter(Boolean).join(' ');
    return name || 'Recello user';
  }

  load(): void {
    this.loading = true;
    this.loadError = false;
    this.auth.getMyProfile().subscribe({
      next: (res) => { this.profile = res; this.loading = false; },
      error: () => { this.loading = false; this.loadError = true; }
    });
  }

  startEdit(): void {
    this.form.first_name = this.profile?.first_name || '';
    this.form.last_name = this.profile?.last_name || '';
    this.form.phone = this.profile?.phone || '';
    this.saveError = '';
    this.saveDone = false;
    this.editing = true;
  }

  cancelEdit(): void { this.editing = false; }

  get canSave(): boolean {
    return !this.saving && this.form.first_name.trim().length > 0;
  }

  save(): void {
    if (!this.canSave) return;
    this.saving = true;
    this.saveError = '';
    this.auth.updateMyProfile({
      phone: this.form.phone.trim() || undefined,
      profile: { first_name: this.form.first_name.trim(), last_name: this.form.last_name.trim() }
    }).subscribe({
      next: (res) => {
        this.profile = res;
        this.saving = false;
        this.editing = false;
        this.saveDone = true;
        setTimeout(() => { this.saveDone = false; }, 2400);
      },
      error: () => {
        this.saving = false;
        this.saveError = "Couldn't save your changes — please try again.";
      }
    });
  }
}
