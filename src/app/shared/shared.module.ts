import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { OptionRowComponent } from './components/option-row/option-row.component';
import { InrPipe } from './pipes/inr.pipe';
import { PageHeaderComponent } from './components/page-header/page-header.component';

@NgModule({
  declarations: [OptionRowComponent, InrPipe, PageHeaderComponent],
  imports: [CommonModule, IonicModule],
  exports: [OptionRowComponent, InrPipe, CommonModule, PageHeaderComponent]
})
export class SharedModule {}
