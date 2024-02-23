import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SchemaProperty } from 'src/app/models/schema-property.model';
import { debounceTime } from 'rxjs/operators';
import { Constants } from 'src/app/common/constants.service';

@Component({
  selector: 'app-edit-object-property-string',
  templateUrl: './edit-object-property-string.component.html',
})
export class EditObjectPropertyStringComponent implements OnInit {
  @Input() value: string;
  @Input() valueName: string;
  @Input() property: SchemaProperty;
  @Input() readonly = false;

  @Output() valueChange = new EventEmitter<string>();

  formControl = new FormControl();

  ngOnInit(): void {
    this.formControl.valueChanges
      .pipe(debounceTime(Constants.debounceTime))
      .subscribe((value) => {
        this.value = value;
        this.valueChange.emit(value);
      });

    this.formControl.setValue(this.value, { emitEvent: false });
  }
}
