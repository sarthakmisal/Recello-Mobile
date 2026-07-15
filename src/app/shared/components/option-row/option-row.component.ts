import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'rc-option-row',
  templateUrl: './option-row.component.html',
  styleUrls: ['./option-row.component.scss'],
  standalone: false
})
export class OptionRowComponent {
  protected basePath = `${environment.apiUrl}/uploads/`;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() selected = false;
  /** When set, this image is shown instead of the title text. */
  @Input() imageUrl: string | null = null;
  /** Shows a checkmark instead of a chevron — used for multi-select questions. */
  @Input() multi = false;
  @Output() rowClick = new EventEmitter<void>();
}
