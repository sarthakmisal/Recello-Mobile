import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellLaptopsPage } from './sell-laptops.page';

const routes: Routes = [
  {
    path: '',
    component: SellLaptopsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellLaptopsPageRoutingModule {}
