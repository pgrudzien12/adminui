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

@Component({
  selector: 'app-manage-usersgroup',
  templateUrl: './manage-usersgroup.component.html',
  styleUrls: ['./manage-usersgroup.component.css'],
})
export class ManageUsersGroupComponent implements OnInit, OnDestroy {
  selectedGroupType;

  selectedGroup: OsduGroup;

  searchControl = new FormControl('');

  sub: Subscription;

  private readonly debounceTime = 1000;

  memberList = [];

  constructor(
    public cmnSrvc: CommonService,
    private restService: RestAPILayerService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
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
}
