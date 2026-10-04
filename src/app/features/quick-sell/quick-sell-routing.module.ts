import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickSellPage } from './pages/quick-sell/quick-sell.page';

const routes: Routes = [
  { path: '', component: QuickSellPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuickSellRoutingModule { }
