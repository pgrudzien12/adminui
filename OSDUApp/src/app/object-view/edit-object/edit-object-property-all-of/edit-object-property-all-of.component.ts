import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Helper } from 'src/app/common/helper.service';
import { SchemaProperty } from 'src/app/models/schema-property.model';
@Component({
  selector: 'app-edit-object-property-all-of',
  templateUrl: './edit-object-property-all-of.component.html',
})
export class EditObjectPropertyAllOfComponent implements OnInit {
  @Input() allOfArray: SchemaProperty[];
  @Input() value: any;
  @Input() valueName: string;
  @Input() definitions: any;
  @Input() readonly = false;

  @Output() valueChange = new EventEmitter<any>();

  mergedProperty: any;

  propertiesKeys: Array<string>;

  objectValuesMissing = [];

  ngOnInit(): void {
    let properties = {};

    this.allOfArray.forEach((allOfElement) => {
      if (allOfElement.type === 'object') {
        properties = { ...properties, ...allOfElement.properties };
        return;
      }

      if (allOfElement.$ref) {
        const ref =
          this.definitions[
            Helper.getSchemaRefNameFromDocumentRef(allOfElement.$ref)
          ];
        properties = { ...properties, ...ref.properties };
      }
    });

    this.mergedProperty = properties;

    this.propertiesKeys = Object.keys(this.mergedProperty);

    if (this.value === null) {
      this.value = {};
    }

    this.refreshObjectValuesMissing();
  }

  fieldAdded(fieldContainer) {
    this.value = { ...this.value, ...fieldContainer };
    this.valueChange.emit(this.value);
    this.refreshObjectValuesMissing();
  }

  refreshObjectValuesMissing() {
    this.objectValuesMissing = [];

    Object.keys(this.mergedProperty).forEach((key) => {
      if (this.value[key] === undefined) {
        this.objectValuesMissing.push(key);
      }
    });
  }

  valueChanged(event: any, key: string) {
    this.value[key] = event;
    this.valueChange.emit(this.value);
    this.refreshObjectValuesMissing();
  }
}
