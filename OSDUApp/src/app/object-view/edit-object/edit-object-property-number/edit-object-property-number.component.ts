import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Constants } from 'src/app/common/constants.service';
import { SchemaProperty } from 'src/app/models/schema-property.model';

@Component({
  selector: 'app-edit-object-property-number',
  templateUrl: './edit-object-property-number.component.html',
})
export class EditObjectPropertyNumberComponent implements OnInit {
  @Input() value: number;
  @Input() valueName: string;
  @Input() property: SchemaProperty;
  @Input() readonly = false;

  @Output() valueChange = new EventEmitter<string>();

  formControl = new FormControl();

  ngOnInit(): void {
    this.formControl.valueChanges
      .pipe(debounceTime(Constants.debounceTime))
      .subscribe((value) => {
        this.valueChange.emit(value);
      });
    this.formControl.setValue(this.value, { emitEvent: false });
  }
}
