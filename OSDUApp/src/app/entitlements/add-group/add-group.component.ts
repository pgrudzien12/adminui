import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { Helper } from 'src/app/common/helper.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { AzureUser } from 'src/app/models/azure-user';
import { OsduGroup } from 'src/app/models/osdu-group.model';
import { roleList } from 'src/config';
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css'],
})
export class AddGroupComponent {
  selectedRole = roleList[0];
  selectedGroup: OsduGroup;
  readonly roleList = roleList;

  constructor(
    private restService: RestAPILayerService,
    @Inject(MAT_DIALOG_DATA) public user: AzureUser,
    private snackBar: MatSnackBar
  ) {}

  requestSubmit() {
    this.addMember().subscribe(this.handleApi);
    return;
  }

  private addMember() {
    return this.restService
      .addMemberGroup(
        {
          role: this.selectedRole.name,
          email: this.user.id,
        },
        this.selectedGroup.email
      )
      .pipe(map(() => true));
  }

  selectedChange(group: OsduGroup) {
    this.selectedGroup = group;
  }

  handleSuccess(success: boolean) {
    if (!success) return;
    this.snackBar.open(
      `${this.user.displayName} has been successfuly added to ${this.selectedGroup.email}`,
      null,
      Helper.snackBarSuccessConfig
    );
  }

  handleError(error) {
    swal.fire(Helper.errorSweetAlertConfig(`${error}`));
  }

  private readonly handleApi = {
    next: this.handleSuccess.bind(this),
    error: this.handleError.bind(this),
  };
}
