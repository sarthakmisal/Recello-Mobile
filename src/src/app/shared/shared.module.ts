import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionRowComponent } from './components/option-row/option-row.component';
import { InrPipe } from './pipes/inr.pipe';

@NgModule({
  declarations: [OptionRowComponent, InrPipe],
  imports: [CommonModule],
  exports: [OptionRowComponent, InrPipe, CommonModule]
})
export class SharedModule {}
