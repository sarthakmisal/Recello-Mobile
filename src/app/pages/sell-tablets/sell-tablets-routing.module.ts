import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellTabletsPage } from './sell-tablets.page';

const routes: Routes = [
  {
    path: '',
    component: SellTabletsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellTabletsPageRoutingModule {}
