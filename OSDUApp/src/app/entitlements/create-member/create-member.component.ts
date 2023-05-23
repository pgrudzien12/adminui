import { Component } from '@angular/core';

import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { privilegeLevel } from '../../../config';

import { MatDialogRef } from '@angular/material/dialog';

import { AzureUser } from 'src/app/models/azure-user';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Helper } from 'src/app/common/helper.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-create-member',
  templateUrl: './create-member.component.html',
})
export class CreateMemberComponent {
  selectedUser: AzureUser = null;

  readonly privilegeLevel = privilegeLevel;
  selectedLevel = privilegeLevel[0];
  readonly tooltipLevelMessage =
    'Select a privilege level for the member to be added\n users.datalake.viewers - Reader Role.\nusers.datalake.editors - Contributor Role.\n the user will be added to the privilege group';

  constructor(
    private restService: RestAPILayerService,
    private dialogRef: MatDialogRef<CreateMemberComponent>,
    private snackBar: MatSnackBar
  ) {}

  selectUser(user: AzureUser) {
    this.selectedUser = user;
  }

  get canSave() {
    return this.selectedUser && this.selectedLevel;
  }

  requestSubmit() {
    this.restService
      .createMember(this.selectedUser.id)
      .pipe(
        catchError((error) => {
          swal.fire(
            Helper.errorSweetAlertConfig(
              `${this.selectedUser.displayName} has not been added`
            )
          );
          return throwError(error);
        }),

        switchMap(() => {
          return this.restService.addMemberToPrivilegeGroup(
            this.selectedUser.id,
            this.selectedLevel.name
          );
        }),

        catchError((error) => {
          swal.fire(
            Helper.warningSweetAlertConfig(
              `${this.selectedUser.displayName} has been added successfully to the users list but NOT to privilege group`
            )
          );
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
      });
  }
}
