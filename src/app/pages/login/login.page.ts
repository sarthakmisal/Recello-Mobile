import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';
  showPass = false;
  loading = false;

  constructor(private navCtrl: NavController) { }

  togglePass() {
    this.showPass = !this.showPass;
  }

  handleLogin() {
    if (!this.email || !this.password) return;
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.navCtrl.back();
    }, 1400);
  }

  back() {
    this.navCtrl.back();
  }
}
