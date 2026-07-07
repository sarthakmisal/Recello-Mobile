import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'sell/mobiles',
    loadChildren: () =>
      import('./pages/sell-mobiles/sell-mobiles.module').then(
        (m) => m.SellMobilesPageModule,
      ),
  },
  {
    path: 'sell/tablets',
    loadChildren: () =>
      import('./pages/sell-tablets/sell-tablets.module').then(
        (m) => m.SellTabletsPageModule,
      ),
  },
  {
    path: 'sell/laptops',
    loadChildren: () =>
      import('./pages/sell-laptops/sell-laptops.module').then(
        (m) => m.SellLaptopsPageModule,
      ),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./pages/orders/orders.module').then((m) => m.OrdersPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'partner',
    loadChildren: () =>
      import('./pages/partner/partner.module').then(
        (m) => m.PartnerPageModule,
      ),
  },
  {
    path: 'blogs',
    loadChildren: () =>
      import('./pages/blogs/blogs.module').then((m) => m.BlogsPageModule),
  },
  {
    path: 'faq',
    loadChildren: () =>
      import('./pages/faq/faq.module').then((m) => m.FaqPageModule),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
  {
    path: 'blogs',
    loadChildren: () => import('./pages/blogs/blogs.module').then( m => m.BlogsPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then( m => m.FaqPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
