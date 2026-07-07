import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsPage } from './settings.page';

@NgModule({
  declarations: [SettingsPage],
  imports: [SharedModule, SettingsRoutingModule],
})
export class SettingsPageModule {}
