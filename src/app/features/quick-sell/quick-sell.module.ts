import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { QuickSellRoutingModule } from './quick-sell-routing.module';
import { QuickSellPage } from './pages/quick-sell/quick-sell.page';

@NgModule({
  declarations: [QuickSellPage],
  imports: [CommonModule, IonicModule, SharedModule, QuickSellRoutingModule]
})
export class QuickSellModule { }
