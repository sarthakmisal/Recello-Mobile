import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, IonicModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, IonicModule],
})
export class SharedModule { }
