import { Component, Input } from '@angular/core';
import { OsduMember } from 'src/app/models/osdu-member.model';
import { roleList } from '../../../config';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { OsduGroup } from 'src/app/models/osdu-group.model';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Helper } from 'src/app/common/helper.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user-role',
  templateUrl: './edit-user-role.component.html',
})
export class EditUserRoleComponent {
  @Input() member: OsduMember;
  @Input() group: OsduGroup;

  readonly roleList = roleList;

  constructor(
    private restService: RestAPILayerService,
    private snackBar: MatSnackBar
  ) {}

  changeRole() {
    this.restService
      .deleteMemberGroup(this.group.email, this.member.email)
      .pipe(
        switchMap(() =>
          this.restService.addMemberGroup(this.member, this.group.email)
        )
      )
      .subscribe(
        () => {
          this.snackBar.open(
            `Role changed successfuly`,
            null,
            Helper.snackBarSuccessConfig
          );
        },
        () => {
          swal.fire(
            Helper.errorSweetAlertConfig(
              'An error occured while changing role of a user'
            )
          );
        }
      );
  }
}
