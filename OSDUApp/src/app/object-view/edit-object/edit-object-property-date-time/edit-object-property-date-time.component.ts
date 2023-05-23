import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SchemaProperty } from 'src/app/models/schema-property.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-object-property-date-time',
  templateUrl: './edit-object-property-date-time.component.html',
})
export class EditObjectPropertyDateTimeComponent implements OnInit {
  @Input() property: SchemaProperty;
  @Input() value: string;
  @Input() valueName: string;
  @Input() readonly = false;

  @Output() valueChange = new EventEmitter<string>();

  formControl = new FormControl();

  ngOnInit(): void {
    this.formControl.valueChanges.subscribe((value: Date) => {
      this.value = value.toISOString();
      this.valueChange.emit(this.value);
    });

    this.formControl.setValue(new Date(this.value), { emitEvent: false });
  }
}
