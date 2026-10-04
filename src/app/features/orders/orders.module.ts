import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersPage } from './pages/orders/orders.page';

@NgModule({
  declarations: [OrdersPage],
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, OrdersRoutingModule]
})
export class OrdersModule {}
