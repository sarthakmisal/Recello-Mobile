import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { AccountDeleteRoutingModule } from './account-delete-routing.module';
import { AccountDeletePage } from './pages/account-delete/account-delete.page';

@NgModule({
  declarations: [AccountDeletePage],
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, AccountDeleteRoutingModule]
})
export class AccountDeleteModule {}
