import { Component } from '@angular/core';

import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { privilegeLevel, roleList } from '../../../config';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AzureUser } from 'src/app/models/azure-user';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Helper } from 'src/app/common/helper.service';
import swal from 'sweetalert2';
import { AddGroupComponent } from '../add-group/add-group.component';

@Component({
  selector: 'app-create-member',
  templateUrl: './create-member.component.html',
  styleUrls: ['./create-member.component.css'],
})
export class CreateMemberComponent {
  selectedUser: AzureUser = null;

  readonly privilegeLevel = privilegeLevel;
  readonly roleList = roleList;
  selectedLevel = privilegeLevel[0];
  selectedRole = roleList[0];
  readonly tooltipLevelMessage =
    'Select a privilege level for the member to be added\n users.datalake.viewers - Reader Role.\nusers.datalake.editors - Contributor Role.\nusers.datalake.admins - Admin Role.\n the user will be added to the privilege group';

  constructor(
    private restService: RestAPILayerService,
    private dialogRef: MatDialogRef<CreateMemberComponent>,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  selectUser(user: AzureUser) {
    this.selectedUser = user;
  }

  get canSave() {
    return this.selectedUser && this.selectedLevel && this.selectedRole;
  }

  requestSubmit() {
    this.restService
      .addMemberToPrivilegeGroup(
        this.selectedUser.id,
        this.selectedLevel.name,
        this.selectedRole.name
      )
      .pipe(
        switchMap(() => {
          return this.restService.createMember(this.selectedUser.id);
        }),

        catchError((error) => {
          swal.fire(Helper.warningSweetAlertConfig(`${error}`));
          return throwError(error);
        })
      )
      .subscribe(() => {
        this.snackBar.open(
          `${this.selectedUser.displayName} has been sucessfully added`,
          null,
          Helper.snackBarSuccessConfig
        );

        this.dialogRef.close(true);
        swal
          .fire(
            Helper.confirmSweetAlertConfig(
              `Do you wish to add ${this.selectedUser.displayName} to more groups?`
            )
          )
          .then((result) => {
            if (result.isConfirmed) {
              this.dialog
                .open(AddGroupComponent, { data: this.selectedUser })
                .afterClosed()
                .subscribe((added) => {
                  if (!added) return;
                });
            }
          });
      });
  }
}
