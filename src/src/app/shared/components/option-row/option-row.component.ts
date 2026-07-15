import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'rc-option-row',
  templateUrl: './option-row.component.html',
  styleUrls: ['./option-row.component.scss'],
  standalone: false
})
export class OptionRowComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() selected = false;
  /** Shows a checkmark instead of a chevron — used for multi-select questions. */
  @Input() multi = false;
  @Output() rowClick = new EventEmitter<void>();
}
