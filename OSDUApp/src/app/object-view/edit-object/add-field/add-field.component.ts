import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { addProperty } from '../edit-object.helper';

@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
})
export class AddFieldComponent implements OnChanges {
  @Input() missingValues: Array<string> = [];
  @Input() objectProperties: any;
  @Input() definitions: any;

  @ViewChild('dialog') dialogRef: TemplateRef<any>;
  @Output() added = new EventEmitter<any>();

  selectedField = null;

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.missingValues) return;

    this.missingValues = this.missingValues.slice().sort((a, b) => {
      return a.localeCompare(b, undefined, { sensitivity: 'base' });
    });
  }

  add() {
    this.dialog
      .open(this.dialogRef, { width: '40%' })
      .afterClosed()
      .subscribe(this.generateField.bind(this));
  }

  generateField(close: boolean) {
    if (!close) return;
    const selectedProperty = this.objectProperties[this.selectedField];
    this.added.emit(
      addProperty(selectedProperty, this.definitions, this.selectedField)
    );
    this.selectedField = null;
  }
}
