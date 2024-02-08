import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { CreateMemberComponent } from '../create-member/create-member.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GraphApiService } from 'src/app/common/graph-api.service';
import { Helper } from 'src/app/common/helper.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { OsduUser } from 'src/app/models/osdu-member.model';
import { Constants } from 'src/app/common/constants.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent implements OnInit {
  searchControl = new FormControl('');

  memberList = [];
  currentSelection: OsduUser[];
  groupCheckboxValue: boolean = false;
  userCheckboxValue: boolean = false;
  appCheckboxValue: boolean = false;
  unknownCheckboxValue: boolean = false;

  constructor(
    public cmnSrvc: CommonService,
    private restService: RestAPILayerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private graphApi: GraphApiService
  ) {
    this.cmnSrvc.bkgndColor = 'Manage <wbr>Members';
    this.showDataGroup();
  }

  ngOnInit(): void {
    this.showDataGroup();

    this.searchControl.valueChanges
      .pipe(debounceTime(Constants.debounceTime))
      .subscribe((value) => this.showDataGroup(value));
  }

  showDataGroup(search = '') {
    this.memberList = [];
    if (!search) {
      this.searchAllMembers();
      return;
    }
    this.searchFilter(search);
  }

  private searchFilter(search: string) {
    this.restService
      .getMembersByString(Constants.userGroup, search)
      .subscribe((result) => {
        this.memberList = result;
        this.cmnSrvc.UsersList = result.map((t) => t.email);
      });
  }

  private searchAllMembers() {
    this.restService
      .getMembersOfEntitlementGroups(Constants.userGroup)
      .subscribe((result) => {
        this.memberList = result['members'];
        this.cmnSrvc.UsersList = result['members'].map((t) => t.email);
      });
  }

  openModalCreateUser() {
    this.dialog
      .open(CreateMemberComponent)
      .afterClosed()
      .subscribe((added: boolean) => {
        if (!added) return;
        this.showDataGroup();
      });
  }

  deleteFunc(user: string) {
    swal
      .fire(
        Helper.warningSweetAlertConfirmConfig(
          'Are you sure you want to delete user ' +
            user +
            ' from the OSDU data partition'
        )
      )
      .then((result) => this.launchDelete.bind(this)(result.isConfirmed, user));
  }

  private launchDelete(isConfirm: boolean, userId: string) {
    if (!isConfirm) return;

    this.restService.deleteMember(userId).subscribe(
      (result) => {
        if (typeof result != 'string') {
          this.showDataGroup();
          this.graphApi.getUserById(userId).subscribe((user) => {
            this.snackBar.open(
              `${user.displayName} has been successfuly deleted`,
              null,
              Helper.snackBarSuccessConfig
            );
          });
        }
      },
      () => {
        swal.fire(
          Helper.errorSweetAlertConfig(
            'Sorry. This user is not authorized to perform this function.'
          )
        );
      }
    );
  }

  removeUsers() {
    let selectionLength = this.currentSelection.length;
    swal
      .fire(
        Helper.warningSweetAlertConfirmConfig(
          'Are you sure you want to delete ' +
            selectionLength +
            ' selected users from the OSDU data partition '
        )
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.launchDeleteUsers();
        }
      });
  }

  private launchDeleteUsers() {
    const deleteObservables = this.currentSelection.map((element) =>
      this.restService.deleteMember(element.member.email)
    );
    forkJoin(deleteObservables).subscribe({
      next: () => {
        // This will be executed after all deletions are successful
        this.showDataGroup();
      },
      error: () => {
        // Handle error
        this.showDataGroup();
      },
    });
  }

  handleSelectionChange(selectedUsers: OsduUser[]): void {
    this.currentSelection = selectedUsers;
  }
}
