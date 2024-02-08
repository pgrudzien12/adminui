import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';
import { ConnectorService } from 'src/app/common/connector.service';
import { SelectionModel } from '@angular/cdk/collections';
import { OsduObject } from 'src/app/models/osdu-object.model';
@Component({
  selector: 'app-add-objview-acl',
  templateUrl: './add-objview-acl.component.html',
  styleUrls: ['./add-objview-acl.component.css'],
})
export class AddACLObjViewComponent implements OnInit {
  groupListData = [];
  selectedGroups = [];
  listAssociated = [];

  selectedAssociatedObjects = new SelectionModel<OsduObject>();

  selectedAssociatedOption;

  readonly selectedAssocitedOptions = {
    onlyObject: 1,
    objectAndAssociated: 2,
  };

  separatorKeysCodes: number[] = [ENTER, COMMA];
  groupCtrl = new FormControl();
  filteredGroups: Observable<string[]>;

  @ViewChild('groupInput') groupInput: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public objectId: string,
    public dialogRef: MatDialogRef<AddACLObjViewComponent>,
    private spinner: NgxSpinnerService,
    public restService: RestAPILayerService,
    private connectorService: ConnectorService
  ) {
    this.filteredGroups = this.groupCtrl.valueChanges.pipe(
      startWith(null),
      map((group: string | null) =>
        group
          ? this.groupListData.filter((allGroup) =>
              allGroup.toLowerCase().includes(group.toLowerCase())
            )
          : this.groupListData.slice()
      )
    );
  }

  ngOnInit(): void {
    this.showListGroup();

    this.getAssociatedObjects();
  }

  closePopup() {
    this.dialogRef.close();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedGroups.push(event.option.viewValue);
    this.groupInput.nativeElement.value = '';
    this.groupCtrl.setValue(null);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.selectedGroups.push(value);
    }
    event.chipInput!.clear();
    this.groupCtrl.setValue(null);
  }

  getAssociatedObjects() {
    this.connectorService
      .getAssociatedObjects(this.objectId)
      .subscribe((res) => {
        this.listAssociated = res;
        this.selectedAssociatedObjects = new SelectionModel(true);
        this.listAssociated.forEach((el) =>
          this.selectedAssociatedObjects.select(el)
        );
      });
  }

  remove(group: string): void {
    const index = this.selectedGroups.indexOf(group);

    if (index >= 0) {
      this.selectedGroups.splice(index, 1);
    }
  }

  addViewerACLToObjects() {
    let objectACL;
    if (
      this.selectedAssociatedOption === this.selectedAssocitedOptions.onlyObject
    ) {
      objectACL = [this.objectId];
    } else {
      objectACL = [...this.selectedAssociatedObjects.selected, this.objectId];
    }
    this.restService.getListRecordsFromStorage(objectACL).subscribe(
      (result) => {
        let records = result['records'];
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
                  objectACL
              )
            );
            this.dialogRef.close(true);
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
