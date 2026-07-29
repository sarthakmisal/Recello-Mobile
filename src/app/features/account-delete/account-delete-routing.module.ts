import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountDeletePage } from './pages/account-delete/account-delete.page';

const routes: Routes = [
  { path: '', component: AccountDeletePage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountDeleteRoutingModule {}
