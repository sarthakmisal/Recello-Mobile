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

    // Renamed from `modal` — Ionic reserves that property name on any
    // component presented via <ion-modal>, so keeping it caused:
    // "[Ionic Error]: modal is a reserved property when using ion-modal."
    constructor(private modalCtrl: ModalController, private auth: AuthService) { }

    close() { this.modalCtrl.dismiss({ success: false }); }

    /** Set once /initiate has told us whether this phone belongs to a new user. */
    private initiated = false;

    start(): void {
        this.error = null;
        if (!this.phone || this.phone.trim().length < 10) { this.error = 'Enter a valid 10-digit phone.'; return; }

        // Second tap for a brand-new user: name field is now showing, go straight to OTP.
        if (this.initiated && this.isNewUser) {
            if (!this.name || this.name.trim().length < 2) { this.error = 'Enter your name.'; return; }
            this.sendOtp();
            return;
        }

        this.loading = true;
        this.auth.initiate(this.phone.trim()).subscribe({
            next: (res) => {
                this.loading = false;
                this.initiated = true;
                this.isNewUser = !!res.isNewUser;
                if (!this.isNewUser) {
                    // Existing user: no name needed, request the OTP right away.
                    this.sendOtp();
                }
                // New user: name field is now visible; wait for the person to tap Continue again.
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
            next: () => { this.loading = false; this.modalCtrl.dismiss({ success: true }); },
            error: () => { this.loading = false; this.error = 'Invalid OTP. Try again.'; }
        });
    }
}
