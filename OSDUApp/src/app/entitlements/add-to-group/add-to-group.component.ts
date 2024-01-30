import { Component, Inject } from '@angular/core';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { roleList } from '../../../config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Helper } from 'src/app/common/helper.service';
import swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OsduGroup } from 'src/app/models/osdu-group.model';
import { AzureUser } from 'src/app/models/azure-user';

@Component({
  selector: 'app-add-to-group',
  templateUrl: './add-to-group.component.html',
  styleUrls: ['./add-to-group.component.css'],
})
export class AddToGroupComponent {
  selectedRole = roleList[0];

  selectedGroup: OsduGroup;

  get roleList() {
    return roleList;
  }

  constructor(
    private restService: RestAPILayerService,
    private dialogRef: MatDialogRef<AddToGroupComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public user: AzureUser
  ) {}

  selectedChange(group: OsduGroup) {
    this.selectedGroup = group;
    this.selectedRole = this.roleList[0];
  }

  handleSuccess(success: boolean) {
    if (!success) return;
    this.snackBar.open(
      `${this.user.displayName} has been successfuly added to ${this.selectedGroup.name}`,
      null,
      Helper.snackBarSuccessConfig
    );
    this.dialogRef.close(true);
  }

  handleError() {
    swal.fire(
      Helper.errorSweetAlertConfig(
        'An error occured while adding to ' + this.selectedGroup.name
      )
    );
  }

  requestSubmit() {
    const data = {
      email: this.user.id,
      role: this.selectedRole.name,
    };
    this.restService
      .addMemberGroup(data, this.selectedGroup.email)
      .pipe(
        catchError((error) => {
          swal.fire(
            Helper.errorSweetAlertConfig(
              `${this.user.displayName} has not been added`
            )
          );
          return throwError(error);
        })
      )
      .subscribe(() => {
        this.snackBar.open(
          `${this.user.displayName} has been sucessfully added`,
          null,
          Helper.snackBarSuccessConfig
        );

        this.dialogRef.close(true);
      });
  }
}
