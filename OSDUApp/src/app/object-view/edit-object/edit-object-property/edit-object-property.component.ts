import { Component, Input, Output, EventEmitter } from '@angular/core';
import { from } from 'rxjs';
import { Helper } from 'src/app/common/helper.service';

import { SchemaProperty } from 'src/app/models/schema-property.model';

import swal from 'sweetalert2';

@Component({
  selector: 'app-edit-object-property',
  templateUrl: './edit-object-property.component.html',
})
export class EditObjectPropertyComponent {
  @Input() property: SchemaProperty;
  @Input() definitions: any;
  @Input() value: any;
  @Input() valueName: string;
  @Input() readonly = false;
  @Input() expanded = false;
  @Input() displayDelete = true;
  @Output() valueChange = new EventEmitter<any>();

  valueChanged(event: any) {
    this.value = event;
    this.valueChange.emit(this.value);
  }

  isField() {
    return (
      (this.property && this.property.type === 'string') ||
      this.property.type === 'number' ||
      this.property.type === 'array' ||
      this.property.type == 'object' ||
      (this.property !== undefined && this.property.type == 'boolean')
    );
  }

  deleteField(valueName) {
    from(
      swal.fire(
        Helper.warningSweetAlertConfirmConfig(
          `Are you sure you want to delete the field ${valueName} ?`
        )
      )
    ).subscribe((result) => {
      if (!result.isConfirmed) return;
      this.valueChanged(undefined);
    });
  }
}
