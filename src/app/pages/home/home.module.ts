import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { ComponentsModule } from '../../components/components-module';
import { HomePage } from './home.page';

const routes: Routes = [{ path: '', component: HomePage }];

@NgModule({
  declarations: [HomePage],
  imports: [SharedModule, ComponentsModule, RouterModule.forChild(routes)],
})
export class HomePageModule {}
