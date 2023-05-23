import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SchemaProperty } from 'src/app/models/schema-property.model';

@Component({
  selector: 'app-edit-object-property-array',
  templateUrl: './edit-object-property-array.component.html',
})
export class EditObjectPropertyArrayComponent implements OnInit {
  @Input() property: SchemaProperty;
  @Input() value: Array<any>;
  @Input() valueName: string;
  @Input() definitions: any;
  @Input() readonly = false;

  @Output() valueChange = new EventEmitter<Array<any>>();

  propertyArray: SchemaProperty;

  valueArray: Array<{ value: any }> = []; //Need this buffer array to prevent bug on refresh with equals value on primitive types variables

  ngOnInit(): void {
    const propertyArray = { ...this.property, ...this.property.items };
    if (!this.property.items.items) delete propertyArray.items;
    if (propertyArray.$ref || propertyArray.allOf || propertyArray.oneOf) {
      delete propertyArray.type;
    }

    if (this.value === null) this.value = [];

    this.propertyArray = propertyArray;
    this.generateValueArray();
  }

  addElement(event: any) {
    this.value.push(event);
    this.valueArray.push({ value: event });
    this.valueChange.emit(this.value);
  }

  delete(index: number) {
    this.value.splice(index, 1);
    this.valueArray.splice(index, 1);
    this.valueChange.emit(this.value);
  }

  valueChanged(event: any, index: number) {
    if (event !== undefined) {
      this.value[index] = event;
      this.valueArray[index].value = event;
      this.valueChange.emit(this.value);
      return;
    }
    this.delete(index);
  }

  generateValueArray() {
    if (!this.value) return;
    this.valueArray = this.value.map((value) => ({ value }));
  }
}
