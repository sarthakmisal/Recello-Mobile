import { Pipe, PipeTransform } from '@angular/core';

const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0
});

@Pipe({ name: 'inr', standalone: false })
export class InrPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) return '₹0';
    return formatter.format(value);
  }
}
