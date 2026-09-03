import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellHomePage } from './pages/sell-home/sell-home.page';
import { QuickSellPage } from './pages/quick-sell/quick-sell.page';

const routes: Routes = [
  { path: '', component: SellHomePage },
  { path: 'quick-sell', component: QuickSellPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellRoutingModule { }
