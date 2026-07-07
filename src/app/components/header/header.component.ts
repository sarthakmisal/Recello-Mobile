import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnDestroy {
  searchOpen = false;
  searchTerm = '';
  private sub: Subscription;

  navItems = [
    { label: 'Home', route: '/' },
    { label: 'Mobiles', route: '/sell/mobiles' },
    { label: 'Tablets', route: '/sell/tablets' },
    { label: 'Laptops', route: '/sell/laptops' },
    { label: 'Blogs', route: '/blogs' },
    { label: 'FAQ', route: '/faq' },
  ];

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private appState: AppStateService,
  ) {
    this.sub = this.appState.searchOpen$.subscribe((v) => {
      this.searchOpen = v;
    });
  }

  toggleSearch() {
    this.appState.toggleSearch();
  }

  openMenu() {
    this.menuCtrl.open('main-menu');
  }

  onSearchChange(val: string) {
    this.searchTerm = val;
    this.appState.setSearchTerm(val);
  }

  clearSearch() {
    this.searchTerm = '';
    this.appState.setSearchTerm('');
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
