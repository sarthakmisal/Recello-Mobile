import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AboutUsRoutingModule } from './about-us-routing.module';
import { AboutUsPage } from './pages/about-us/about-us.page';

@NgModule({
  declarations: [AboutUsPage],
  imports: [CommonModule, IonicModule, AboutUsRoutingModule]
})
export class AboutUsModule { }
