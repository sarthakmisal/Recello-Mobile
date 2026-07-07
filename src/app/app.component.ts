import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CatalogService } from './services/catalog.service';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { Service } from './models/catalog.models';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  accent?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  services: Service[] = [];
  private subs = new Subscription();

  staticNavItems: NavItem[] = [
    { label: 'Home', icon: 'home-outline', route: '/' },
    { label: 'My Orders', icon: 'receipt-outline', route: '/orders' },
    { label: 'Blog', icon: 'newspaper-outline', route: '/blogs' },
    { label: 'FAQ', icon: 'help-circle-outline', route: '/faq' },
    { label: 'Settings', icon: 'settings-outline', route: '/settings' },
  ];

  bottomNavItems: NavItem[] = [
    { label: 'Become a Partner', icon: 'people-outline', route: '/partner', accent: true },
  ];

  get serviceNavItems(): NavItem[] {
    const iconMap: Record<string, string> = {
      mobiles: 'phone-portrait-outline',
      tablets: 'tablet-portrait-outline',
      laptops: 'laptop-outline',
      watches: 'watch-outline',
      'smart-watches': 'watch-outline',
      cameras: 'camera-outline',
      gaming: 'game-controller-outline',
    };
    return this.services.map(s => ({
      label: `Sell ${s.name}`,
      icon: iconMap[s.slug] ?? 'pricetag-outline',
      route: `/sell/${s.slug}`,
    }));
  }

  constructor(
    public auth: AuthService,
    public theme: ThemeService,
    private catalog: CatalogService,
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.catalog.getServices().subscribe(services => {
        this.services = services.filter(s => s.isActive !== false);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  logout(): void {
    this.auth.logout().subscribe({ error: () => this.auth.clearSession() });
  }
}
