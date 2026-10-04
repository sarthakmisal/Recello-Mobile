import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

import { PrivacyPolicyPageRoutingModule } from './privacy-policy-routing.module';

import { PrivacyPolicyPage } from './privacy-policy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PrivacyPolicyPageRoutingModule
  ],
  declarations: [PrivacyPolicyPage]
})
export class PrivacyPolicyPageModule {}
