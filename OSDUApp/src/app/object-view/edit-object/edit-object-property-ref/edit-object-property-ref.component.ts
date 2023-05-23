import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SchemaProperty } from 'src/app/models/schema-property.model';
import { Helper } from 'src/app/common/helper.service';

@Component({
  selector: 'app-edit-object-property-ref',
  templateUrl: './edit-object-property-ref.component.html',
})
export class EditObjectPropertyRefComponent implements OnInit {
  @Input() property: SchemaProperty;
  @Input() value: any;
  @Input() valueName: string;
  @Input() definitions: any;
  @Input() readonly = false;

  @Output() valueChange = new EventEmitter<any>();

  propertyRef: SchemaProperty;

  constructor() {}

  ngOnInit(): void {
    const ref = Helper.getSchemaRefNameFromDocumentRef(this.property.$ref);
    this.propertyRef = JSON.parse(JSON.stringify(this.definitions[ref]));

    if (this.property.title) this.propertyRef.title = this.property.title;
  }

  valueChanged(event: any) {
    this.value = event;
    this.valueChange.emit(this.value);
  }
}
