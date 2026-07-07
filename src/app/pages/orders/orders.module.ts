import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { OrdersPage } from './orders.page';

const routes: Routes = [{ path: '', component: OrdersPage }];

@NgModule({
    declarations: [OrdersPage],
    imports: [SharedModule, RouterModule.forChild(routes)],
})
export class OrdersPageModule { }
