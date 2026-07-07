import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartnerPage } from './partner.page';

const routes: Routes = [
  {
    path: '',
    component: PartnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnerPageRoutingModule {}
