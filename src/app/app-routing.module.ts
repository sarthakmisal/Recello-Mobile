import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginModalComponent } from './core/components/login-modal/login-modal.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/sell/sell.module').then(m => m.SellModule)
  },
  {// TESTING ONLY ON PROD COMMENTED
    path: 'login',
    component: LoginModalComponent
  },
  {
    path: 'account-delete',
    loadChildren: () => import('./features/account-delete/account-delete.module').then(m => m.AccountDeleteModule)
  },
  {
    path: 'account_delete',
    redirectTo: 'account-delete',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    loadChildren: () => import('./features/orders/orders.module').then(m => m.OrdersModule)
  },
  
  {
    path: 'privacy-policy',
    loadChildren: () => import('./features/privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
