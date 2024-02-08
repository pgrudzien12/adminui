import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Helper } from 'src/app/common/helper.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { OsduGroup } from 'src/app/models/osdu-group.model';
import { OsduObject } from 'src/app/models/osdu-object.model';
import swal from 'sweetalert2';

@Component({
  selector: 'app-delete-from-datagroup',
  templateUrl: './delete-from-datagroup.component.html',
})
export class DeleteFromDatagroupComponent {
  @Input() objects: OsduObject[] = [];
  @Input() datagroup: OsduGroup;
  @Output() deleted = new EventEmitter();

  @ViewChild('dialogTemplate') dialogTemplate: TemplateRef<any>;

  constructor(
    private dialog: MatDialog,
    private restService: RestAPILayerService,
    private spinnerService: NgxSpinnerService
  ) {}

  openDialog() {
    this.dialog.open(this.dialogTemplate, { autoFocus: false });
  }

  launchDelete() {
    this.objects.forEach((object) => {
      object.acl.viewers = this.filterDatagroup(object.acl.viewers);
      this.spinnerService.show();
      this.dialog.closeAll();
      this.restService
        .createOrUpdateRecords(this.objects)
        .subscribe(this.handleAPI);
    });
  }

  handleAPI = {
    next: this.handleSucess.bind(this),
    error: this.handleError.bind(this),
  };

  private handleSucess() {
    swal.fire(
      Helper.sucessSweetAlertConfig('Objects removed successfuly from group')
    );
    this.spinnerService.hide();
    this.deleted.emit();
  }

  private handleError() {
    swal.fire(
      Helper.errorSweetAlertConfig(
        'An error occured while removing files from datagroup'
      )
    );

    this.spinnerService.hide();
  }

  private filterDatagroup(groups: string[]) {
    if (groups.length === 1) return groups;
    return groups.filter(
      (group) => group.toLowerCase() !== this.datagroup.email.toLowerCase()
    );
  }
}
