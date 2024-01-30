import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-object-container',
  templateUrl: './edit-object-container.component.html',
  styleUrls: ['./edit-object-container.component.css'],
})
export class EditObjectContainerComponent {
  @Input() label: string = '';
  @Input() expanded = false;
  @Input() icon;
}
