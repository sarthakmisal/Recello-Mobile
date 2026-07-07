import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'sell/:serviceSlug',
    loadComponent: () => import('./pages/sell-flow/sell-flow.page').then(m => m.SellFlowPage),
  },
  {
    path: 'sell/:serviceSlug/:brandSlug',
    loadComponent: () => import('./pages/sell-flow/sell-flow.page').then(m => m.SellFlowPage),
  },
  {
    path: 'sell/:serviceSlug/:brandSlug/:modelSlug',
    loadComponent: () => import('./pages/sell-flow/sell-flow.page').then(m => m.SellFlowPage),
  },
  {
    path: 'sell/:serviceSlug/:brandSlug/:modelSlug/:configId',
    loadComponent: () => import('./pages/sell-flow/sell-flow.page').then(m => m.SellFlowPage),
  },
  {
    path: 'sell/:serviceSlug/:brandSlug/:modelSlug/:configId/checkout',
    loadComponent: () => import('./pages/sell-flow/sell-flow.page').then(m => m.SellFlowPage),
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'partner',
    loadChildren: () => import('./pages/partner/partner.module').then(m => m.PartnerPageModule),
  },
  {
    path: 'blogs',
    loadChildren: () => import('./pages/blogs/blogs.module').then(m => m.BlogsPageModule),
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then(m => m.FaqPageModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
