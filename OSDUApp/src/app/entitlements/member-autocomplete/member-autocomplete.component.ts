import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import {
  OsduMember,
  OsduMemberWithAzureUser,
} from 'src/app/models/osdu-member.model';
import { Observable, of } from 'rxjs';
import { Helper } from 'src/app/common/helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-member-autocomplete',
  templateUrl: './member-autocomplete.component.html',
  styleUrls: ['./member-autocomplete.component.css'],
})
export class MemberAutocompleteComponent {
  @Output() selectedChange = new EventEmitter<OsduMemberWithAzureUser>();
  @Input() selected: OsduMember;
  @Input() label: string = 'Search for member';

  @Input() group =
    'users@' + environment.settings.data_partition + '.dataservices.energy';

  listOfUsers = [];
  filterLength = 0;

  constructor(private restService: RestAPILayerService) {}

  refreshedList$(filter: string): Observable<OsduMemberWithAzureUser[]> {
    if (!filter || typeof filter !== 'string') {
      this.listOfUsers = [];
      this.filterLength = 0;
      return of([]);
    }
    this.restService
      .getUsersAppsAndGroupByString(filter)
      .subscribe((result) => {
        this.listOfUsers = result;
        this.filterLength = filter.length;
      });
    return this.restService.getUsersAppsAndGroupByString(filter);
  }

  displayFn(member: OsduMemberWithAzureUser): string {
    return Helper.displayOsduMemberWithAzureUser(member);
  }

  optionSelected(event: OsduMemberWithAzureUser) {
    this.selected = event;
    this.selectedChange.emit(this.selected);
  }

  clearMember() {
    this.selected = null;
    this.selectedChange.emit(this.selected);
  }
}
