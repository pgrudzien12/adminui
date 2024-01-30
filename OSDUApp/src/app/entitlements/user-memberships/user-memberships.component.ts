import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { OsduMember, OsduUser } from 'src/app/models/osdu-member.model';
import { OsduGroup } from 'src/app/models/osdu-group.model';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddToGroupComponent } from '../add-to-group/add-to-group.component';
import { AzureUser } from 'src/app/models/azure-user';
import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';

@Component({
  selector: 'app-user-memberships',
  templateUrl: './user-memberships.component.html',
})
export class UserMembershipsComponent implements OnInit, OnChanges {
  @Input() user: AzureUser;

  groups: OsduMember[] = [];

  deleteResults = [];

  currentSelection: OsduUser[];
  filteredGroups: OsduMember[] = [];

  searchControl = new FormControl('');

  selectedGroup: string = 'none';

  readonly displayedColumns = ['select', 'displayName', 'role'];

  constructor(
    private restService: RestAPILayerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log(this.user.id);
    if (!this.user) return;
    this.getUserGroups();

    this.searchControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(this.filterGroups.bind(this));
  }

  ngOnChanges(): void {
    this.getUserGroups();
    this.selectedGroupChange('none');

    this.searchControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(this.filterGroups.bind(this));
  }

  private getUserGroups(type: string = 'none') {
    this.restService
      .getUsersAccessRights(this.user.id, type)
      .subscribe((groups: OsduGroup[]) => {
        console.log('Got ', groups.length, ' groups');
        this.groups = groups.map((g) => ({
          email: g.email,
          role: 'MEMBER',
        }));

        this.filterGroups(this.searchControl.value);
        console.log(this.filteredGroups);
      });
    console.log(this.filteredGroups);
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

  openAddToGroupDialog() {
    this.dialog
      .open(AddToGroupComponent, { data: this.user })
      .afterClosed()
      .subscribe((added) => {
        if (!added) return;
        // wait 2 seconds for the group to be created
        setTimeout(() => {
          this.getUserGroups();
        }, 2000);
      });
  }

  removeUsers() {
    let selectionLength = this.currentSelection.length;
    swal
      .fire(
        Helper.warningSweetAlertConfirmConfig(
          'Are you sure you want to remove user from ' +
            selectionLength +
            ' selected groups? '
        )
      )
      .then((result) => {
        if (result.isConfirmed) {
          console.log(this.currentSelection);
          this.currentSelection.forEach((group) => {
            console.log(group.member.email);
            console.log(this.user.id);
            this.restService
              .deleteMemberGroup(group.member.email, this.user.id)
              .subscribe(
                () => {
                  this.deleteResults.push({
                    group: group.member.email,
                    error: false,
                  });
                  if (
                    this.deleteResults.length === this.currentSelection.length
                  ) {
                    this.postRemoveFromGroup();
                  }
                },
                () => {
                  this.deleteResults.push({
                    group: group.member.email,
                    error: true,
                  });
                  if (
                    this.deleteResults.length === this.currentSelection.length
                  ) {
                    this.postRemoveFromGroup();
                  }
                }
              );
          });
        }
      });
  }

  private postRemoveFromGroup() {
    const listOfSuccess = this.deleteResults
      .filter((result) => result.error === false)
      .map((obj) => obj.group)
      .join(', ');
    const listOfErrors = this.deleteResults
      .filter((result) => result.error === true)
      .map((obj) => obj.group)
      .join(', ');
    swal.fire(
      Helper.infoSweetAlertConfig(
        `User was deleted from ${
          this.deleteResults.filter((result) => result.error === false).length
        } groups: 
          ${listOfSuccess}.

           You cannot delete this user from ${
             this.deleteResults.filter((result) => result.error === true).length
           } groups (check permissions): 
          ${listOfErrors}`
      )
    );

    this.currentSelection = [];
    this.deleteResults = [];
    setTimeout(() => {
      this.getUserGroups();
    }, 2000);
  }

  handleSelectionChange(selectedGroups: OsduUser[]): void {
    this.currentSelection = selectedGroups;
  }
}
