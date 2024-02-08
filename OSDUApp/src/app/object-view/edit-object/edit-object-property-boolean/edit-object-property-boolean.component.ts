import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SchemaProperty } from 'src/app/models/schema-property.model';

@Component({
  selector: 'app-edit-object-property-boolean',
  templateUrl: './edit-object-property-boolean.component.html',
})
export class EditObjectPropertyBooleanComponent {
  @Input() value: boolean;
  @Input() valueName: string;
  @Input() property: SchemaProperty;
  @Input() readonly = false;

  @Output() valueChange = new EventEmitter<boolean>();

  checkChange(event: MatCheckboxChange) {
    this.valueChange.emit(event.checked);
  }
}
