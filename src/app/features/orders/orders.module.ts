import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersPage } from './pages/orders/orders.page';

@NgModule({
  declarations: [OrdersPage],
  imports: [CommonModule, FormsModule, IonicModule, OrdersRoutingModule]
})
export class OrdersModule {}
