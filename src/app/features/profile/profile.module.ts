import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePage } from './pages/profile/profile.page';

@NgModule({
  declarations: [ProfilePage],
  imports: [CommonModule, FormsModule, IonicModule, ProfileRoutingModule]
})
export class ProfileModule { }
