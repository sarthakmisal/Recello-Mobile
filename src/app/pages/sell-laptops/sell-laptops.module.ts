import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { SellLaptopsPage } from './sell-laptops.page';

const routes: Routes = [{ path: '', component: SellLaptopsPage }];

@NgModule({
  declarations: [SellLaptopsPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class SellLaptopsPageModule { }
