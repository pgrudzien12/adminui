import { Component, Input } from '@angular/core';
import { AzureUser } from '../models/azure-user';

@Component({
  selector: 'app-user-icon',
  templateUrl: './user-icon.component.html',
})
export class UserIconComponent {
  @Input() user: AzureUser;
}
