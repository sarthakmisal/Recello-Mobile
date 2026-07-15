import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'rc-login-modal',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.scss'],
    standalone: false,
})
export class LoginModalComponent {
    phone = '';
    name = '';
    otp = '';
    step: 'phone' | 'otp' = 'phone';
    loading = false;
    error: string | null = null;
    isNewUser = false;
    requestId: string | null = null;

    constructor(private modal: ModalController, private auth: AuthService) { }

    close() { this.modal.dismiss({ success: false }); }

    start(): void {
        this.error = null;
        if (!this.phone || this.phone.trim().length < 10) { this.error = 'Enter a valid 10-digit phone.'; return; }
        this.loading = true;
        this.auth.initiate(this.phone.trim()).subscribe({
            next: (res) => {
                this.loading = false;
                this.isNewUser = !!res.isNewUser;
                if (!this.isNewUser) {
                    this.sendOtp();
                }
            },
            error: () => { this.loading = false; this.error = 'Could not start auth. Try again.'; }
        });
    }

    sendOtp(): void {
        this.error = null; this.loading = true;
        this.auth.requestOtp(this.phone.trim()).subscribe({
            next: (res) => { this.requestId = res.id; this.step = 'otp'; this.loading = false; },
            error: () => { this.loading = false; this.error = 'Could not send OTP.'; }
        });
    }

    resend(): void {
        if (!this.requestId) return;
        this.auth.resendOtp(this.requestId, this.phone.trim()).subscribe({ next: (r) => { this.requestId = r.id; } });
    }

    verify(): void {
        if (!this.requestId || !this.otp) { this.error = 'Enter OTP.'; return; }
        this.loading = true; this.error = null;
        this.auth.verifyOtp(this.requestId, this.otp.trim(), this.isNewUser ? this.name.trim() : undefined).subscribe({
            next: () => { this.loading = false; this.modal.dismiss({ success: true }); },
            error: () => { this.loading = false; this.error = 'Invalid OTP. Try again.'; }
        });
    }
}
