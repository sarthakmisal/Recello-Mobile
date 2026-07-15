import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { SellRoutingModule } from './sell-routing.module';
import { SellHomePage } from './pages/sell-home/sell-home.page';
import { SellQuoteModalComponent } from './components/sell-quote-modal/sell-quote-modal.component';

@NgModule({
  declarations: [SellHomePage, SellQuoteModalComponent],
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, SellRoutingModule]
})
export class SellModule {}
