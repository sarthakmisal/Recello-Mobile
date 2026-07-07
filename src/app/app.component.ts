import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent {
  navItems = [
    { label: 'Home', icon: 'home-outline', route: '/' },
    { label: 'Sell Mobiles', icon: 'phone-portrait-outline', route: '/sell/mobiles' },
    { label: 'Sell Tablets', icon: 'tablet-portrait-outline', route: '/sell/tablets' },
    { label: 'Sell Laptops', icon: 'laptop-outline', route: '/sell/laptops' },
    { label: 'My Orders', icon: 'receipt-outline', route: '/orders' },
    { label: 'Blogs', icon: 'newspaper-outline', route: '/blogs' },
    { label: 'FAQ', icon: 'help-circle-outline', route: '/faq' },
  ];

  bottomItems = [
    { label: 'Become a Partner', icon: 'people-outline', route: '/partner', accent: true },
    { label: 'Login', icon: 'log-in-outline', route: '/login', accent: false },
  ];
}
