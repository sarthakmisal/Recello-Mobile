import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { authCopy } from '../../shared/site-data';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule],
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
    mode: 'login' | 'partner' = 'login';
    form = { name: '', phone: '', email: '', company: '', city: '', otp: '' };

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.mode = (this.route.snapshot.data['mode'] as 'login' | 'partner') || 'login';
    }

    get copy() {
        return authCopy[this.mode];
    }

    submit(): void {
        localStorage.setItem(`recello-${this.mode}`, JSON.stringify(this.form));
        this.router.navigateByUrl('/home');
    }
}
