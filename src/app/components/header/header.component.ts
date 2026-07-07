import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppStateService } from '../../services/app-state.service';
import { CatalogService } from '../../services/catalog.service';
import { AuthService } from '../../services/auth.service';
import { Service } from '../../models/catalog.models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchOpen = false;
  searchTerm = '';
  services: Service[] = [];
  private subs = new Subscription();

  readonly staticNav = [
    { label: 'Home', route: '/' },
    { label: 'Orders', route: '/orders' },
    { label: 'FAQ', route: '/faq' },
    { label: 'Blog', route: '/blogs' },
  ];

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private appState: AppStateService,
    private catalog: CatalogService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.appState.searchOpen$.subscribe(v => { this.searchOpen = v; })
    );
    this.subs.add(
      this.catalog.getServices().subscribe(s => {
        this.services = s.filter(x => x.isActive !== false);
      })
    );
  }

  get navItems() {
    const serviceItems = this.services.map(s => ({
      label: s.name,
      route: `/sell/${s.slug}`,
    }));
    return [...this.staticNav.slice(0, 1), ...serviceItems, ...this.staticNav.slice(1)];
  }

  toggleSearch() { this.appState.toggleSearch(); }

  openMenu() { this.menuCtrl.open('main-menu'); }

  onSearchChange(val: string) {
    this.searchTerm = val;
    this.appState.setSearchTerm(val);
  }

  clearSearch() {
    this.searchTerm = '';
    this.appState.setSearchTerm('');
  }

  navigateTo(route: string) { this.router.navigate([route]); }

  ngOnDestroy() { this.subs.unsubscribe(); }
}
