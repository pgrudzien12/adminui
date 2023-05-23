import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-object-property-one-off',
  templateUrl: './edit-object-property-one-off.component.html',
})
export class EditObjectPropertyOneOffComponent implements OnInit {
  @Input() definitions: any;
  @Input() value: any;
  @Input() oneOfArray: Array<any> = [];
  @Input() readonly = false;
  @Input() valueName: string;

  @Output() valueChange = new EventEmitter<any>();

  selectedType: any;

  ngOnInit(): void {
    if (this.oneOfArray.length > 0) {
      this.selectedType = this.oneOfArray[0];
    }
  }

  selectionChange(event) {
    this.selectedType = null;
    setTimeout(() => (this.selectedType = event), 10);
  }

  valueChanged(event: any) {
    this.value = event;
    this.valueChange.emit(this.value);
  }
}
