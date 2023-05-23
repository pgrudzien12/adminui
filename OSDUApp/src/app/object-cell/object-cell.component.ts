import { Component, Input, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-object-cell',
  templateUrl: './object-cell.component.html',
})
export class ObjectCellComponent {
  @Input() object: any;

  @Input() objectParent: string;

  @ViewChild('modal') modalRef: TemplateRef<any>;

  stringified = '';

  private static readonly maxLength = 50;

  constructor(private dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(this.modalRef);
  }
}
