import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { AddMemberComponent } from '../add-member/add-member.component';
import { OsduGroup } from 'src/app/models/osdu-group.model';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { OsduUser } from 'src/app/models/osdu-member.model';

@Component({
  selector: 'app-manage-usersgroup',
  templateUrl: './manage-usersgroup.component.html',
  styleUrls: ['./manage-usersgroup.component.css'],
})
export class ManageUsersGroupComponent implements OnInit, OnDestroy {
  selectedGroupType;

  selectedGroup: OsduGroup;

  searchControl = new FormControl('');
  myCheckboxControl = new FormControl(false);
  form: FormGroup;
  groupCheckboxValue: boolean = false;
  userCheckboxValue: boolean = false;
  appCheckboxValue: boolean = false;
  unknownCheckboxValue: boolean = false;

  sub: Subscription;

  private readonly debounceTime = 1000;

  memberList = [];
  filteredMemberList = [];
  currentSelection: OsduUser[];

  constructor(
    public cmnSrvc: CommonService,
    private restService: RestAPILayerService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.cmnSrvc.bkgndColor = 'Manage <wbr>Group <wbr>Members';
  }

  ngOnInit(): void {
    this.searchControl.disable({ emitEvent: false });

    this.searchControl.valueChanges
      .pipe(debounceTime(this.debounceTime))
      .subscribe((value) => this.searchFilter(value));

    this.sub = this.route.queryParams.subscribe((params) => {
      if (!params.email) {
        this.launchSearch(null);
        return;
      }

      this.selectedGroup = {
        email: params.email as string,
        name: '',
        description: '',
      };

      this.launchSearch(this.selectedGroup);
    });

    this.form = this.fb.group({
      checkboxes: this.fb.array([]),
    });

    // Populate the form with checkboxes

    //this.populateCheckboxes();

    // Subscribe to changes in the form group
    // this.form.valueChanges.subscribe((value) => {
    //   this.typeFilter(value);
    //   // Do something with the updated value
    // });
  }

  populateCheckboxes() {
    const checkboxArray = this.form.get('checkboxes') as FormArray;
    checkboxArray.push(this.fb.group({ isChecked: false, label: 'Group' }));
    checkboxArray.push(this.fb.group({ isChecked: false, label: 'User' }));
    checkboxArray.push(this.fb.group({ isChecked: false, label: 'Unknown' }));
    checkboxArray.push(
      this.fb.group({ isChecked: false, label: 'Application' })
    );

    // Add more checkboxes as needed
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  selectedChange(event: OsduGroup) {
    this.router.navigate(['entitlement', 'manage-usersgroup'], {
      queryParams: {
        email: event?.email,
      },
    });
  }

  private launchSearch(event: OsduGroup) {
    if (!event) {
      this.selectedGroupType = null;
      this.memberList = [];
      this.selectedGroup = null;
      this.searchControl.disable({ emitEvent: false });
      this.searchControl.setValue('', { emitEvent: false });
      return;
    }
    this.showDataGroup(event.email);
    this.selectedGroup = event;
    this.selectedGroupType = event.email;
    this.searchControl.enable({ emitEvent: false });
  }

  showDataGroup(groupEmail) {
    this.memberList = [];
    this.restService
      .getMembersOfEntitlementGroups(groupEmail)
      .subscribe((result) => {
        this.memberList = result.members;
      });
  }

  openModalCreate() {
    this.dialog
      .open(AddMemberComponent, { data: this.selectedGroupType })
      .afterClosed()
      .subscribe((added) => {
        if (!added) return;
        this.showDataGroup(this.selectedGroupType);
      });
  }

  // onCheckboxChange(event, index: number) {
  //   const checkboxArray = this.form.get('checkboxes') as FormArray;
  //   const changedCheckbox = checkboxArray.at(index);
  //   console.log('Checkbox changed:', changedCheckbox.value);
  // }

  searchFilter(search) {
    if (!search) {
      this.showDataGroup(this.selectedGroupType);
      return;
    }
    this.restService
      .getMembersByString(this.selectedGroupType, search)
      .subscribe((result) => {
        this.memberList = result;
      });
  }

  deleteFunc(user) {
    swal
      .fire(
        Helper.warningSweetAlertConfirmConfig(
          'Are you sure you want to delete user ' +
            user +
            ' from ' +
            this.selectedGroupType
        )
      )
      .then((result) => this.launchDelete.bind(this)(result.isConfirmed, user));
  }

  private launchDelete(isConfirm: boolean, userId: string) {
    if (!isConfirm) return;
    this.restService
      .deleteMemberGroup(this.selectedGroupType, userId)
      .subscribe(
        () => {
          this.showDataGroup(this.selectedGroupType);
        },
        (err) => {
          swal.fire(
            Helper.errorSweetAlertConfig(
              'Sorry. This user is not authorized to perform this function.'
            )
          );
          console.log(err);
        }
      );
  }

  deleteMembers() {
    let selectionLength = this.currentSelection.length;
    swal
      .fire(
        Helper.warningSweetAlertConfirmConfig(
          'Are you sure you want to remove ' +
            selectionLength +
            ' selected users from ' +
            this.selectedGroupType
        )
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.launchDeleteMembers();
        }
      });
  }

  private launchDeleteMembers() {
    const deleteObservables = this.currentSelection.map((element) =>
      this.restService.deleteMemberGroup(
        this.selectedGroupType,
        element.member.email
      )
    );
    forkJoin(deleteObservables).subscribe({
      next: (results) => {
        // This will be executed after all deletions are successful
        console.log('All users deleted', results);
        this.showDataGroup(this.selectedGroupType);
      },
      error: (error) => {
        // Handle error
        console.error('Error deleting users', error);
        this.showDataGroup(this.selectedGroupType);
      },
    });
  }

  handleSelectionChange(selectedUsers: OsduUser[]): void {
    this.currentSelection = selectedUsers;
  }
}
