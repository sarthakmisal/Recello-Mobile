import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellHomePage } from './pages/sell-home/sell-home.page';

const routes: Routes = [
  { path: '', component: SellHomePage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellRoutingModule {}
