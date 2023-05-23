import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SchemaProperty } from 'src/app/models/schema-property.model';

@Component({
  selector: 'app-edit-object-property-object',
  templateUrl: './edit-object-property-object.component.html',
})
export class EditObjectPropertyObjectComponent implements OnInit {
  @Input() property: SchemaProperty;
  @Input() value: any;
  @Input() valueName: string;
  @Input() definitions: any;
  @Input() readonly = false;
  @Output() valueChange = new EventEmitter<any>();

  objectProperties: Array<SchemaProperty>;
  objectPropertiesKeys: Array<string>;
  objectValuesMissing: Array<string>;

  ngOnInit(): void {
    if (!this.property || !this.property.properties) return;
    this.objectProperties = [];
    this.objectPropertiesKeys = [];
    this.objectValuesMissing = [];

    Object.keys(this.property.properties).forEach((key) => {
      this.objectProperties.push(this.property.properties[key]);
      this.objectPropertiesKeys.push(key);
    });

    if (this.value === null) {
      this.value = {};
    }

    this.refreshObjectValuesMissing();
  }

  valueChanged(event: any, key: string) {
    this.value[key] = event;
    this.valueChange.emit(this.value);
    this.refreshObjectValuesMissing();
  }

  fieldAdded(fieldContainer) {
    this.value = { ...this.value, ...fieldContainer };
    this.valueChange.emit(this.value);
    this.refreshObjectValuesMissing();
  }

  refreshObjectValuesMissing() {
    this.objectValuesMissing = [];

    Object.keys(this.property.properties).forEach((key) => {
      if (this.value[key] === undefined) {
        this.objectValuesMissing.push(key);
      }
    });
  }
}
