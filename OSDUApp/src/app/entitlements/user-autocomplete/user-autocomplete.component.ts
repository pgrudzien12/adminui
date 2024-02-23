import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GraphApiService } from 'src/app/common/graph-api.service';
import { Observable, of, forkJoin } from 'rxjs';
import { AzureUser } from 'src/app/models/azure-user';
import { map } from 'rxjs/operators';
import { Helper } from 'src/app/common/helper.service';

@Component({
  selector: 'app-user-autocomplete',
  templateUrl: './user-autocomplete.component.html',
  styleUrls: ['./user-autocomplete.component.css'],
})
export class UserAutocompleteComponent {
  @Output() selectedChange = new EventEmitter<AzureUser>();
  @Input() selected: AzureUser;
  @Input() label: string = 'Search for user';

  constructor(private graphAPI: GraphApiService) {}

  refreshedList$(filter: string): Observable<AzureUser[]> {
    if (filter === '') return of([]);

    return forkJoin({
      azureUsers: this.graphAPI.getUsersByString(filter),
      azureApps: this.graphAPI.getApplicationByString(filter),
    }).pipe(
      map((join) => {
        const azureUsers = join.azureUsers ?? ([] as AzureUser[]);
        const azureApps = join.azureApps ?? ([] as AzureUser[]);
        return [...azureUsers, ...azureApps];
      })
    );
  }

  displayFn(user: AzureUser): string {
    return Helper.displayAzureUser(user);
  }

  displaySubTextFn(user: AzureUser): string {
    return 'ID: ' + user.id;
  }

  optionSelected(event: AzureUser) {
    this.selected = event;
    this.selectedChange.emit(this.selected);
  }

  clearUser() {
    this.selected = null;
    this.selectedChange.emit(this.selected);
  }
}
