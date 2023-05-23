import {
  Component,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { CreatGroupComponent } from '../creat-group/creat-group.component';
import {
  NgbdSortableHeader,
  SortEvent,
} from 'src/app/common/sortable.directive';
import { HeaderService } from 'src/app/common/headers.service';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';

@Component({
  selector: 'app-manage-groups',
  templateUrl: './manage-groups.component.html',
  styleUrls: ['./manage-groups.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [HeaderService, DecimalPipe],
})
export class ManageGroupsComponent {
  error_Message_Div: string = '';
  UserList: any = [];
  fullUserList: any = [];

  pageNum: number;
  myInput;
  headers;
  istoggle: boolean = false;
  groupCount = 0;
  @ViewChildren(NgbdSortableHeader) headersort: QueryList<NgbdSortableHeader>;

  modalOptions: NgbModalOptions;
  closeResult: string;
  constructor(
    public service: HeaderService,
    private router: Router,
    private modalService: NgbModal,
    public cmnSrvc: CommonService,
    private restService: RestAPILayerService,
    private spinner: NgxSpinnerService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };
    this.cmnSrvc.bkgndColor = 'Manage<wbr> Groups';

    this.getEntitlements();
  }

  clearSearch() {
    this.myInput = '';
    this.UserList = this.fullUserList;
    this.istoggle = false;
    this.sort('email');
  }

  getEntitlements() {
    this.spinner.show();
    this.restService.getEntitlementGroups().subscribe(
      (result) => {
        this.spinner.hide();

        this.error_Message_Div = '';
        this.UserList = result.groups;
        this.fullUserList = result.groups;
        if (result.groups.length > 0) {
          this.headers = Object.keys(result.groups[0]);
          this.istoggle = false;
          this.sort('email');
        }
        if (this.myInput) this.searchFilter(this.myInput);
      },
      (err) => {
        this.spinner.hide();
        this.error_Message_Div = err;
      }
    );
  }

  openModal(user) {
    const modalRef = this.modalService.open(EditUserComponent);
    modalRef.componentInstance.userDetails = user;
    let that = this;
    modalRef.componentInstance.passEntryEdit.subscribe((result) => {
      console.log('res', result);
      that.UserList.forEach((element) => {
        if (element.email == result.data.email) {
          element.name = result.data.name;
          element.description = result.data.description;
        }
      });
    });
  }

  openModalCreate() {
    const modalRef = this.modalService.open(CreatGroupComponent);
    modalRef.componentInstance.passEntryAdd.subscribe(() => {
      setTimeout(this.getEntitlements.bind(this), 1000);
    });
  }

  searchFilter(search) {
    this.UserList = this.fullUserList.filter((x) =>
      x['name'].toLowerCase().includes(search)
    );
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headersort.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  sort(colName) {
    if (this.istoggle) {
      this.UserList.sort((a, b) =>
        a[colName].toLowerCase() > b[colName].toLowerCase() ? -1 : 1
      );
      this.istoggle = !this.istoggle;
    } else {
      this.UserList.sort((a, b) =>
        a[colName].toLowerCase() < b[colName].toLowerCase() ? -1 : 1
      );
      this.istoggle = !this.istoggle;
    }
  }
  openManageMembers(group) {
    this.router.navigate(['/entitlement/manage-usersgroup'], {
      queryParams: { email: group.email },
    });
  }

  deleteFunc(group) {
    swal
      .fire(
        Helper.warningSweetAlertConfirmConfig(
          'Are you sure you want to delete group ' + group + ' ?'
        )
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.restService.deleteGroup(group).subscribe(
            (result) => {
              if (typeof result != 'string') {
                this.UserList = this.UserList.filter((x) => x.email != group);
                this.fullUserList = this.fullUserList.filter(
                  (x) => x.email != group
                );
              }
              this.spinner.hide();
            },
            () => {
              this.spinner.hide();

              swal.fire(
                Helper.errorSweetAlertConfig(
                  'Sorry. This user is not authorized to perform this function.'
                )
              );
            }
          );
        }
      });
  }
}
