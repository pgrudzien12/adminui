import { Component, OnInit, Input } from '@angular/core';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { OsduMember } from 'src/app/models/osdu-member.model';
import { OsduGroup } from 'src/app/models/osdu-group.model';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-user-memberships',
  templateUrl: './user-memberships.component.html',
})
export class UserMembershipsComponent implements OnInit {
  @Input() userId: string;

  groups: OsduMember[] = [];

  filteredGroups: OsduMember[] = [];

  searchControl = new FormControl('');

  selectedGroup: string = 'none';

  readonly displayedColumns = ['displayName', 'role'];

  constructor(private restService: RestAPILayerService) {}

  ngOnInit(): void {
    if (!this.userId) return;
    this.getUserGroups();

    this.searchControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(this.filterGroups.bind(this));
  }

  private getUserGroups(type: string = 'none') {
    this.restService
      .getUsersAccessRights(this.userId, type)
      .subscribe((groups: OsduGroup[]) => {
        this.groups = groups.map((g) => ({
          email: g.email,
          role: 'MEMBER',
        }));

        this.filterGroups(this.searchControl.value);
      });
  }

  private filterGroups(value: string) {
    if (!value) {
      this.filteredGroups = [...this.groups];
      return;
    }

    this.filteredGroups = this.groups.filter((g) =>
      g.email.toLowerCase().includes(value.toLowerCase())
    );
  }

  selectedGroupChange(group: string) {
    if (!group) this.getUserGroups();
    this.selectedGroup = group;
    this.getUserGroups(group);
  }
}
