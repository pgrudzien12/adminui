import { Component, Input, Output, EventEmitter } from '@angular/core';
import { groupList } from 'src/config';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-groupe-type-radio-button',
  templateUrl: './groupe-type-radio-button.component.html',
  styleUrls: ['./groupe-type-radio-button.component.css'],
})
export class GroupeTypeRadioButtonComponent {
  readonly groupList = groupList;

  @Input() selectedGroup: string = 'none';

  @Input() label = 'Select a group type : ';

  @Output() selectedGroupChange = new EventEmitter<string>();

  selected(event: MatRadioChange) {
    this.selectedGroupChange.emit(event.value);
  }
}
