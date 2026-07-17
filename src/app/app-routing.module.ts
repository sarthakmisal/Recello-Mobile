import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginModalComponent } from './core/components/login-modal/login-modal.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/sell/sell.module').then(m => m.SellModule)
  },
  {
    path: '',
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
