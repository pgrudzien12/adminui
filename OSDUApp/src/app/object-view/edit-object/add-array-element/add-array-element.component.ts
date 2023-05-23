import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Helper } from 'src/app/common/helper.service';
import { SchemaProperty } from 'src/app/models/schema-property.model';
import { addProperty } from '../edit-object.helper';

@Component({
  selector: 'app-add-array-element',
  templateUrl: './add-array-element.component.html',
})
export class AddArrayElementComponent {
  @Input() property: SchemaProperty;
  @Input() definitions: any;

  @Output() added = new EventEmitter<any>();

  @ViewChild('dialog') dialogRef: TemplateRef<any>;

  constructor(private dialog: MatDialog) {}

  add() {
    this.added.emit(
      addProperty(this.property.items, this.definitions, 'object')['object']
    );
  }

  getTypeName(element: any) {
    if (element.$ref) {
      return Helper.getSchemaRefNameFromDocumentRef(element.$ref);
    }

    return element.title;
  }
}
