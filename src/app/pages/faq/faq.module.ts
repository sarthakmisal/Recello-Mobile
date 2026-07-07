import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { FaqPage } from './faq.page';

const routes: Routes = [{ path: '', component: FaqPage }];

@NgModule({
  declarations: [FaqPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class FaqPageModule { }
