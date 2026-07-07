import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { SellMobilesPage } from './sell-mobiles.page';

const routes: Routes = [{ path: '', component: SellMobilesPage }];

@NgModule({
  declarations: [SellMobilesPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class SellMobilesPageModule { }
