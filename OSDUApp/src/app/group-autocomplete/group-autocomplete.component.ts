import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { OsduGroup } from '../models/osdu-group.model';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-group-autocomplete',
  templateUrl: './group-autocomplete.component.html',
  styleUrls: ['./group-autocomplete.component.css'],
})
export class GroupAutocompleteComponent implements OnInit {
  @Output() selectedChange = new EventEmitter<OsduGroup>();
  @Input() selected: OsduGroup;
  @Input() label: string = 'Search for group';
  @Input() userId: string; // User's ID

  groups: OsduGroup[] = [];
  excludedGroups: string[] = []; // IDs of groups to exclude

  selectedGroups: OsduGroup[] = [];
  enteredTextInput: string = '';

  constructor(private restService: RestAPILayerService) {}

  ngOnInit() {
    // Fetch all groups initially
    this.restService.getEntitlementGroups().subscribe((res: any) => {
      this.groups = res.groups ?? [];
      // Fetch user's current groups and filter
      this.getUsersCurrentGroups();
    });
  }

  getUsersCurrentGroups() {
    if (this.userId) {
      this.restService
        .getUsersAccessRights(this.userId)
        .subscribe((userGroups: OsduGroup[]) => {
          this.excludedGroups = userGroups.map((group) => group.email); // Assuming 'name' is the unique identifier
          this.filterGroups();
        });
    }
  }

  filterGroups() {
    this.groups = this.groups.filter(
      (group) => !this.excludedGroups.includes(group.email)
    );
  }

  refreshedList$(filter: string): Observable<OsduGroup[]> {
    if (!filter || typeof filter !== 'string') return of(this.groups);

    this.enteredTextInput = filter;
    this.selectedGroups = this.groups.filter(
      (g) =>
        g.email?.toLowerCase().includes(filter.toLowerCase()) &&
        !this.excludedGroups.includes(g.name) // Exclude groups that user is already in
    );
    return of(this.selectedGroups);
  }
  displayFn(group: OsduGroup): string {
    return group ? group.email : '';
  }

  optionSelected(event: OsduGroup) {
    this.selected = event;
    this.selectedChange.emit(this.selected);
  }

  clearGroup() {
    this.selected = null;
    this.selectedChange.emit(this.selected);
  }

  handleEnterKey(enteredText: string): void {
    this.selectedGroups = this.groups.filter(
      (g) =>
        g.email?.toLowerCase().includes(enteredText.toLowerCase()) &&
        !this.excludedGroups.includes(g.name) // Exclude groups that user is already in
    );
    if (this.selectedGroups.length === 0) {
      this.enteredTextInput = enteredText;
    } else if (this.selectedGroups.length === 1) {
      this.selected = this.selectedGroups[0];
      this.selectedChange.emit(this.selected);
    }
  }
}
