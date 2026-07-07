import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { PartnerPage } from './partner.page';

const routes: Routes = [{ path: '', component: PartnerPage }];

@NgModule({
  declarations: [PartnerPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class PartnerPageModule { }
