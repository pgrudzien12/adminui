import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { CommonService } from 'src/app/common/common.service';
import { groupPermissionList } from 'src/config';

@Component({
  selector: 'app-creat-group',
  templateUrl: './creat-group.component.html',
  styleUrls: ['./creat-group.component.css'],
})
export class CreatGroupComponent {
  groupListNew = groupPermissionList;
  permissionLevel = [];
  selectedGroupType = '0';
  selectedPermissionLevel = '0';
  selectedgroupName = '';
  selecteddescription = '';
  selectedresourceName = '';
  isSuccess: boolean;
  isError: boolean;
  successMessge: string;
  @Output() passEntryAdd: EventEmitter<any> = new EventEmitter();
  @ViewChild('myForm', { static: true }) myForm: ElementRef;
  errorMessge: string;
  constructor(
    public activeModal: NgbActiveModal,
    public cmnSrvc: CommonService,
    private spinner: NgxSpinnerService,
    public restService: RestAPILayerService
  ) {}

  closePopup() {
    this.activeModal.close();
  }

  requestSubmit() {
    let count = 0;

    if (
      this.selectedgroupName == '' ||
      this.selectedgroupName == null ||
      this.selecteddescription == '' ||
      this.selecteddescription == null
    ) {
      count += 1;
    }

    if (count > 0) {
      this.isError = true;
      this.isSuccess = false;
      this.errorMessge = 'Please enter all the fields.';
    } else {
      const data = {
        name: this.selectedgroupName,
        description: this.selecteddescription,
      };

      this.spinner.show();
      this.restService.createEntitlementGroup(data).subscribe(
        () => {
          this.spinner.hide();

          this.isSuccess = true;
          this.isError = false;

          this.successMessge =
            'You have successfully created ' +
            this.selectedgroupName +
            ' group!';
          this.passEntryAdd.emit({ data: data });
          this.myFormreset();
        },
        (err) => {
          this.spinner.hide();
          this.isError = true;
          this.isSuccess = false;
          this.errorMessge = err;
          console.log(err);
        }
      );
    }
  }

  selParam(type, val) {
    if (type == 'Group') {
      // this.selectedgroupName=val;
      this.permissionLevel = this.groupListNew.filter(
        (x) => x.group == val
      )[0].value;
      this.selectedPermissionLevel = '0';
    }
    if (type == 'Permission') {
      this.selectedPermissionLevel = val;
    }

    if (this.selectedresourceName == '') {
      if (this.selectedPermissionLevel == '0') {
        if (this.selectedGroupType == '0') {
          this.selectedgroupName = this.selectedresourceName;
        } else {
          this.selectedgroupName = this.selectedGroupType;
        }
      } else {
        this.selectedgroupName =
          this.selectedGroupType + '.' + this.selectedPermissionLevel;
      }
    } else {
      if (this.selectedPermissionLevel == '0') {
        if (this.selectedGroupType == '0') {
          this.selectedgroupName = this.selectedresourceName;
        } else {
          this.selectedgroupName =
            this.selectedGroupType + '.' + this.selectedresourceName;
        }
      } else {
        this.selectedgroupName =
          this.selectedGroupType +
          '.' +
          this.selectedresourceName +
          '.' +
          this.selectedPermissionLevel;
      }
    }
  }

  myFormreset() {
    const resetForm = <HTMLFormElement>document.getElementById('myForm');
    resetForm.reset();
    this.permissionLevel = [];
    this.selectedgroupName = '';
    this.selectedGroupType = '0';
    this.selectedPermissionLevel = '0';
    this.selectedresourceName = '';
  }
}
