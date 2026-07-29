import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../../../core/services/auth.service';
import { AccountDeleteStatus } from '../../../../core/models/sell-flow.models';

/** Sentinel message the API returns when no deletion has been requested yet. */
const DEFAULT_REASON = 'Account will be automatically deleted after 90 days';
const GRACE_PERIOD_DAYS = 90;

@Component({
  selector: 'rc-account-delete',
  templateUrl: './account-delete.page.html',
  styleUrls: ['./account-delete.page.scss'],
  standalone: false
})
export class AccountDeletePage implements OnInit {
  readonly gracePeriodDays = GRACE_PERIOD_DAYS;

  loading = true;
  loadError = false;
  status: AccountDeleteStatus | null = null;

  reasonInput = '';
  confirmed = false;
  submitting = false;
  submitError = '';

  constructor(
    private auth: AuthService,
    private alertCtrl: AlertController,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.loadStatus();
  }

  /** True once a deletion has actually been requested — the API swaps its default sentinel reason for the user's own. */
  get isScheduled(): boolean {
    return !!this.status && this.status.reason !== DEFAULT_REASON;
  }

  /** % of the 90-day grace period that has already elapsed, for the progress ring/bar. */
  get progressPct(): number {
    if (!this.status) return 0;
    const elapsed = GRACE_PERIOD_DAYS - this.status.remaining_days;
    return Math.min(100, Math.max(0, Math.round((elapsed / GRACE_PERIOD_DAYS) * 100)));
  }

  get canSubmit(): boolean {
    return this.confirmed && this.reasonInput.trim().length >= 3 && !this.submitting;
  }

  goBack(): void {
    this.location.back();
  }

  loadStatus(): void {
    this.loading = true;
    this.loadError = false;
    this.auth.getAccountDeleteStatus().subscribe({
      next: (res) => { this.status = res; this.loading = false; },
      error: () => { this.loading = false; this.loadError = true; }
    });
  }

  async confirmDelete(): Promise<void> {
    if (!this.canSubmit) return;
    const alert = await this.alertCtrl.create({
      header: 'Delete your account?',
      message: `This schedules permanent deletion in ${GRACE_PERIOD_DAYS} days. You can't undo this once it's confirmed.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Yes, delete', role: 'destructive', handler: () => this.submitDelete() }
      ]
    });
    await alert.present();
  }

  private submitDelete(): void {
    this.submitting = true;
    this.submitError = '';
    this.auth.requestAccountDelete(this.reasonInput.trim()).subscribe({
      next: (res: any) => { this.status = res; this.submitting = false; },
      error: () => {
        this.submitting = false;
        this.submitError = 'Something went wrong — please try again.';
      }
    });
  }
  myRedirect(path: string) {
    window.location.href = path
  }
}
