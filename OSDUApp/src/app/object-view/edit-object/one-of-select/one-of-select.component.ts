import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Helper } from 'src/app/common/helper.service';
import { SchemaProperty } from 'src/app/models/schema-property.model';

@Component({
  selector: 'app-one-of-select',
  templateUrl: './one-of-select.component.html',
})
export class OneOfSelectComponent {
  @Input() oneOfArray: Array<any> = [];
  @Output() selectionChange = new EventEmitter<SchemaProperty>();

  @Input() selection: any;

  getTypeName(element: any) {
    if (element.$ref) {
      return Helper.getSchemaRefNameFromDocumentRef(element.$ref);
    }

    if (element.type === 'null') return element.type;

    if (!element.title) return element.type ?? 'No name';

    return element.title;
  }

  selectionChanged(event: MatSelectChange) {
    this.selection = event.value;
    this.selectionChange.emit(this.selection);
  }
}
