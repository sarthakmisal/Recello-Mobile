import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { AboutUsRoutingModule } from './about-us-routing.module';
import { AboutUsPage } from './pages/about-us/about-us.page';

@NgModule({
  declarations: [AboutUsPage],
  imports: [CommonModule, IonicModule, SharedModule, AboutUsRoutingModule]
})
export class AboutUsModule { }
