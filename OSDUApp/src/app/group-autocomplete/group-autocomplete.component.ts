import { Component, Input, EventEmitter, Output } from '@angular/core';
import { OsduGroup } from '../models/osdu-group.model';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-group-autocomplete',
  templateUrl: './group-autocomplete.component.html',
})
export class GroupAutocompleteComponent {
  @Output() selectedChange = new EventEmitter<OsduGroup>();
  @Input() selected: OsduGroup;
  @Input() label: string = 'Search for group';

  groups: OsduGroup[] = [];

  constructor(private restService: RestAPILayerService) {
    this.restService.getEntitlementGroups().subscribe((res: any) => {
      this.groups = res.groups ?? [];
    });
  }

  refreshedList$(filter: string): Observable<OsduGroup[]> {
    if (!filter || typeof filter !== 'string') return of(this.groups);
    return of(
      this.groups.filter((g) =>
        g.email?.toLowerCase().includes(filter.toLowerCase())
      )
    );
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
}
