import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

type Step = 'phone' | 'otp';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  step: Step = 'phone';
  phone = '';
  otp = '';
  loading = false;
  error = '';
  returnUrl = '/';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn) {
      this.router.navigate(['/']);
      return;
    }
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
  }

  requestOtp(): void {
    const cleaned = this.phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      this.error = 'Please enter a valid 10-digit mobile number.';
      return;
    }
    this.error = '';
    this.loading = true;
    this.auth.requestOtp(cleaned).subscribe({
      next: () => {
        this.step = 'otp';
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to send OTP. Please try again.';
        this.loading = false;
      },
    });
  }

  verifyOtp(): void {
    if (this.otp.length < 4) {
      this.error = 'Please enter the OTP sent to your phone.';
      return;
    }
    this.error = '';
    this.loading = true;
    const cleaned = this.phone.replace(/\D/g, '');
    this.auth.verifyOtp(cleaned, this.otp).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl(this.returnUrl, { replaceUrl: true });
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Invalid OTP. Please try again.';
        this.loading = false;
      },
    });
  }

  resendOtp(): void {
    this.otp = '';
    this.step = 'phone';
    this.error = '';
  }

  back(): void { this.navCtrl.back(); }
}
