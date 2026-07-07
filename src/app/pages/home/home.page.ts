import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CatalogService } from '../../services/catalog.service';
import { Service, Brand, Banner } from '../../models/catalog.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  loading = true;
  heroVisible = false;
  services: Service[] = [];
  brands: Brand[] = [];
  banners: Banner[] = [];
  private subs = new Subscription();

  readonly stats = [
    { val: '₹2Cr+', label: 'Paid Out' },
    { val: '50K+', label: 'Devices Sold' },
    { val: '4.9★', label: 'Rating' },
  ];

  readonly steps = [
    {
      icon: 'phone-portrait-outline',
      title: 'Choose Your Device',
      desc: 'Select brand, model and describe the condition accurately.',
      color: '#4F7EFF',
      bg: 'rgba(79,126,255,0.10)',
      num: '01',
    },
    {
      icon: 'pricetag-outline',
      title: 'Get Instant Quote',
      desc: 'Receive a competitive price estimate in under 30 seconds.',
      color: '#00D2B8',
      bg: 'rgba(0,210,184,0.10)',
      num: '02',
    },
    {
      icon: 'cash-outline',
      title: 'Get Paid Fast',
      desc: 'Schedule free pickup and receive payment within 24 hours.',
      color: '#FFB547',
      bg: 'rgba(255,181,71,0.10)',
      num: '03',
    },
  ];

  readonly serviceIconMap: Record<string, string> = {
    mobiles: 'phone-portrait-outline',
    tablets: 'tablet-portrait-outline',
    laptops: 'laptop-outline',
    watches: 'watch-outline',
    'smart-watches': 'watch-outline',
    cameras: 'camera-outline',
    gaming: 'game-controller-outline',
  };

  readonly serviceGradMap: Record<string, string> = {
    mobiles: 'grad-mobiles',
    tablets: 'grad-tablets',
    laptops: 'grad-laptops',
  };

  constructor(private router: Router, private catalog: CatalogService) {}

  ngOnInit() {
    this.subs.add(
      forkJoin({
        services: this.catalog.getServices().pipe(catchError(() => of([]))),
        brands: this.catalog.getBrands().pipe(catchError(() => of([]))),
        banners: this.catalog.getActiveBanners().pipe(catchError(() => of([]))),
      }).subscribe(({ services, brands, banners }) => {
        this.services = (services as Service[]).filter(s => s.isActive !== false);
        this.brands = brands as Brand[];
        this.banners = banners as Banner[];
        this.loading = false;
        setTimeout(() => { this.heroVisible = true; }, 60);
      })
    );
  }

  getServiceIcon(slug: string): string {
    return this.serviceIconMap[slug] ?? 'pricetag-outline';
  }

  getServiceGrad(slug: string, idx: number): string {
    if (this.serviceGradMap[slug]) return this.serviceGradMap[slug];
    const fallbacks = ['grad-mobiles', 'grad-tablets', 'grad-laptops', 'grad-default'];
    return fallbacks[idx % fallbacks.length];
  }

  navigate(route: string) { this.router.navigate([route]); }

  ngOnDestroy() { this.subs.unsubscribe(); }
}
