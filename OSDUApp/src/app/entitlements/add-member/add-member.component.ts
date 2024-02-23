import { Component, Inject } from '@angular/core';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { roleList } from '../../../config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OsduMemberWithAzureUser } from 'src/app/models/osdu-member.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Helper } from 'src/app/common/helper.service';
import swal from 'sweetalert2';
import { from, Observable, of } from 'rxjs';
import { OsduMember } from 'src/app/models/osdu-member.model';
import { map, switchMap } from 'rxjs/operators';
import { Constants } from 'src/app/common/constants.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css'],
})
export class AddMemberComponent {
  selectedRole = roleList[0];

  selectedMember: OsduMemberWithAzureUser;

  get roleList() {
    if (!this.selectedMember || !Helper.isGroup(this.selectedMember))
      return roleList;

    return roleList.filter((r) => r.name !== 'OWNER');
  }

  constructor(
    private restService: RestAPILayerService,
    private dialogRef: MatDialogRef<AddMemberComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public groupName: string
  ) {}

  selectedChange(member: OsduMemberWithAzureUser) {
    this.selectedMember = member;
    this.selectedRole = this.roleList[0];
  }

  handleSuccess(success: boolean) {
    if (!success) return;
    this.snackBar.open(
      `${Helper.displayOsduMemberWithAzureUserName(
        this.selectedMember
      )} has been successfuly added to ${this.groupName}`,
      null,
      Helper.snackBarSuccessConfig
    );
    this.dialogRef.close(true);
  }

  handleError() {
    swal.fire(
      Helper.errorSweetAlertConfig(
        'An error occured while adding ' +
          Helper.displayOsduMemberWithAzureUser(this.selectedMember)
      )
    );
  }

  requestSubmit() {
    if (Helper.isGroup(this.selectedMember)) {
      this.addMember().subscribe(this.handleApi);
      return;
    }

    this.checkForUserInUserGroups()
      .pipe(
        switchMap((isInUserGroup) => {
          if (isInUserGroup) {
            return this.addMember.bind(this)();
          }
          return this.createMember.bind(this)();
        })
      )
      .subscribe(this.handleApi);
  }

  private addMember() {
    return this.restService
      .addMemberGroup(
        {
          role: this.selectedRole.name,
          email: this.selectedMember.email,
        },
        this.groupName
      )
      .pipe(map(() => true));
  }

  private createMember() {
    const swalModal = from(
      swal.fire(
        Helper.confirmSweetAlertConfig(
          `${Helper.displayOsduMemberWithAzureUserName(
            this.selectedMember
          )} is not a OSDU member. Are you sure you want to add ${Helper.displayOsduMemberWithAzureUserName(
            this.selectedMember
          )} to OSDU members ?`
        )
      )
    );

    return swalModal.pipe(
      switchMap((result) => {
        if (!result.isConfirmed) return of(false);

        return this.restService.createMember(this.selectedMember.email).pipe(
          switchMap(() =>
            this.restService.addMemberToUsersViewers(this.selectedMember.email)
          ),
          switchMap(() => this.addMember())
        );
      })
    );
  }

  private checkForUserInUserGroups(): Observable<boolean> {
    return this.restService
      .getMembersOfEntitlementGroups(Constants.userGroup)
      .pipe(
        map((res: any) => {
          const members = <OsduMember[]>res.members;
          return !!members.find((m) => m.email === this.selectedMember.email);
        })
      );
  }

  private readonly handleApi = {
    next: this.handleSuccess.bind(this),
    error: this.handleError.bind(this),
  };
}
