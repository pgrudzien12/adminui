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
import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';

@Component({
  selector: 'app-add-acl',
  templateUrl: './add-acl.component.html',
  styleUrls: ['./add-acl.component.css'],
})
export class AddACLComponent {
  isSuccess: boolean;
  isError: boolean;
  successMessge: string;
  errorMessge = '';
  groupListData = [];
  selectedGroups = [];

  @ViewChild('myForm', { static: true }) myForm: ElementRef;
  @Output() passEntryAdd: EventEmitter<any> = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    public cmnSrvc: CommonService,
    private spinner: NgxSpinnerService,
    public restService: RestAPILayerService
  ) {}

  closePopup() {
    this.activeModal.close();
  }

  addViewerACLToObjects() {
    this.restService
      .getListRecordsFromStorage(this.cmnSrvc.selectedObjects)
      .subscribe(
        (result) => {
          let records = result['records'];
          // let SelectedUsersGroups = this.selectedGroups.concat(this.selectedUsers)
          let SelectedUsersGroups = this.selectedGroups;
          for (let record in records) {
            for (let email in SelectedUsersGroups) {
              if (
                !records[record]['acl']['viewers'].includes(
                  SelectedUsersGroups[email]
                )
              ) {
                records[record]['acl']['viewers'].push(
                  SelectedUsersGroups[email]
                );
              }
            }
          }

          this.restService.createOrUpdateRecords(records).subscribe(
            () => {
              swal.fire(
                Helper.sucessSweetAlertConfig(
                  'Emails : ' +
                    SelectedUsersGroups +
                    ' has beed added successfully to the ACL viewers list of : ' +
                    this.cmnSrvc.selectedObjects
                )
              );
            },
            (err) => {
              swal.fire(Helper.errorSweetAlertConfig(err));
              this.spinner.hide();
            }
          );
        },
        (err) => {
          swal.fire(Helper.errorSweetAlertConfig(err));
          this.spinner.hide();
        }
      );
  }

  showListGroup() {
    this.restService.getEntitlementGroups().subscribe(
      (result) => {
        this.groupListData = result.groups
          .map((x) => x.email)
          .filter((group) => group.startsWith('data.'));
      },
      (err) => {
        swal.fire(Helper.errorSweetAlertConfig(err));
        this.spinner.hide();
      }
    );
  }
}
