import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SchemaProperty } from 'src/app/models/schema-property.model';
import { formatDateProperty } from '../edit-object.helper';

@Component({
  selector: 'app-edit-property-date',
  templateUrl: './edit-property-date.component.html',
})
export class EditPropertyDateComponent implements OnInit {
  @Input() property: SchemaProperty;
  @Input() value: string;
  @Input() valueName: string;
  @Input() readonly = false;

  @Output() valueChange = new EventEmitter<string>();

  formControl = new FormControl();

  ngOnInit(): void {
    this.formControl.valueChanges.subscribe((value: Date) => {
      this.value = formatDateProperty(value);
      this.valueChange.emit(this.value);
    });

    this.formControl.setValue(new Date(this.value), { emitEvent: false });
  }
}
