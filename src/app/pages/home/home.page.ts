import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  loading = true;
  heroVisible = false;

  stats = [
    { val: '₹2Cr+', label: 'Paid Out' },
    { val: '50K+', label: 'Devices Sold' },
    { val: '4.9★', label: 'Rating' },
  ];

  categories = [
    {
      label: 'Mobiles',
      desc: 'Smartphones & phones',
      icon: 'phone-portrait-outline',
      route: '/sell/mobiles',
      cls: 'grad-mobiles',
    },
    {
      label: 'Tablets',
      desc: 'iPads & Android tabs',
      icon: 'tablet-portrait-outline',
      route: '/sell/tablets',
      cls: 'grad-tablets',
    },
    {
      label: 'Laptops',
      desc: 'MacBooks & Windows',
      icon: 'laptop-outline',
      route: '/sell/laptops',
      cls: 'grad-laptops',
    },
  ];

  brands = [
    'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Google', 'Nothing',
    'Realme', 'Vivo', 'Oppo', 'Motorola', 'Nokia', 'Sony',
  ];

  steps = [
    {
      icon: 'phone-portrait-outline',
      title: 'Choose Your Device',
      desc: 'Select brand, model and describe the condition accurately.',
      color: '#4F7EFF',
      bg: 'rgba(79,126,255,0.12)',
      num: '01',
    },
    {
      icon: 'pricetag-outline',
      title: 'Get Instant Quote',
      desc: 'Receive a competitive price estimate in under 30 seconds.',
      color: '#00D2B8',
      bg: 'rgba(0,210,184,0.12)',
      num: '02',
    },
    {
      icon: 'cash-outline',
      title: 'Get Paid Fast',
      desc: 'Schedule free pickup and receive payment within 24 hours.',
      color: '#FFB547',
      bg: 'rgba(255,181,71,0.12)',
      num: '03',
    },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
      setTimeout(() => {
        this.heroVisible = true;
      }, 60);
    }, 700);
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
