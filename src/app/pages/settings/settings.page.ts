import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ThemeService, Theme } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage {
  constructor(
    public theme: ThemeService,
    public auth: AuthService,
    private router: Router,
    private navCtrl: NavController,
  ) {}

  setTheme(t: Theme): void { this.theme.set(t); }

  logout(): void {
    this.auth.logout().subscribe({
      complete: () => this.router.navigate(['/login']),
      error: () => {
        this.auth.clearSession();
        this.router.navigate(['/login']);
      },
    });
  }

  back(): void { this.navCtrl.back(); }

  readonly appVersion = '1.0.0';

  get prefersDark(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
