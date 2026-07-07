import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { SellTabletsPage } from './sell-tablets.page';

const routes: Routes = [{ path: '', component: SellTabletsPage }];

@NgModule({
  declarations: [SellTabletsPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class SellTabletsPageModule { }
