import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { CommonService } from 'src/app/common/common.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-legal-tag',
  templateUrl: './add-legal-tag.component.html',
  styleUrls: ['./add-legal-tag.component.css'],
})
export class AddLegalTagComponent implements OnInit {
  @Output() passEntryAdd: EventEmitter<any> = new EventEmitter();
  @ViewChild('myForm', { static: true }) myForm: ElementRef;
  successMessge = '';
  errorMessge = '';
  isSuccess: boolean = false;
  isError: boolean = false;
  isNameSpin: boolean = false;
  isNameChecked: boolean = false;
  isNameavailable: boolean = false;

  countryList = [];
  dataTypeList = [];
  personalDataTypeList = [];
  securityClassificationList = [];
  exportClassificationList = [];
  selecteddataType = '0';
  selectedpersonalData = '0';
  selectedsecurityClassification = '0';
  selectedexportClassification = '0';
  selectedlegalname = '';
  selecteddescription = '';
  selectedexpirationDate = '';
  selectedoriginator = '';
  selectedcontractid = '';
  selectedcountryOfOrigin = [];
  countrysel = [];
  dpdstart;

  dropdownList = [];

  dropdownSettings: IDropdownSettings = {};

  constructor(
    public activeModal: NgbActiveModal,
    public cmnSrvc: CommonService,
    private spinner: NgxSpinnerService,
    public restService: RestAPILayerService
  ) {}

  ngOnInit(): void {
    this.legalTagProperties();
  }

  closePopup() {
    let that = this;
    let count = 0;
    for (let element in this) {
      if (element.startsWith('selected')) {
        if (this[element] != null) {
          if (
            this[element].toString() == '' ||
            this[element].toString() == '0' ||
            this[element].toString() == null ||
            this[element].toString() == undefined
          ) {
            //count=0;
          } else {
            count += 1;
          }
        }
      }
    }

    if (count == 0) {
      that.activeModal.close();
    } else {
      swal
        .fire(
          Helper.warningSweetAlertConfirmConfig(
            'Unsaved data exists. Do you want to continue and cancel?'
          )
        )
        .then((result) => {
          if (result.isConfirmed) {
            that.activeModal.close();
          }
        });
    }
  }

  legalTagProperties() {
    this.spinner.show();
    this.restService.getLegalTagProperties().subscribe(
      (result) => {
        this.spinner.hide();

        let tempList = [];

        tempList = Object.entries(result['countriesOfOrigin']);
        let countrylists = [];
        tempList.forEach((element) => {
          countrylists.push({
            item_id: element[0],
            item_text: element[0] + ',(' + element[1] + ')',
          });
        });

        countrylists.sort((a, b) =>
          a['item_id'].toLowerCase() < b['item_id'].toLowerCase() ? -1 : 1
        );
        this.countryList = countrylists;
        // this.countryList.sort();

        this.dropdownSettings = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_text',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          closeDropDownOnSelection: true,
          itemsShowLimit: 2,
          allowSearchFilter: true,
        };

        this.dataTypeList = result['dataTypes'];
        this.personalDataTypeList = result['personalDataTypes'];
        this.securityClassificationList = result['securityClassifications'];
        this.exportClassificationList =
          result['exportClassificationControlNumbers'];
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  requestSubmit() {
    const resetForm = <HTMLFormElement>document.getElementById('myForm');
    let count = 0;
    for (let element in this) {
      if (element.includes('selected')) {
        if (this[element] == null) {
          count += 1;
        } else {
          if (this[element].toString() == '') {
            count += 1;
          } else if (this[element].toString() == '0') {
            count += 1;
          }
        }
      }
    }

    // if(resetForm.legalname.value!="" && resetForm.contractid.value !="" && resetForm.dataType.value!="" &&
    // resetForm.expirationDate.value!="" && resetForm.description.value!="" && resetForm.originator.value!="" &&
    // resetForm.exportClassification.value!="" && resetForm.personalData.value!="" && resetForm.securityClassification.value!="" && resetForm.countryOfOrigin.value!="" ){

    if (count == 0) {
      const countries = this.selectedcountryOfOrigin.map((x) => x.item_id);
      let month = '' + this.selectedexpirationDate['month'];
      if (month.length < 2) {
        month = '0' + month;
      }
      let day = '' + this.selectedexpirationDate['day'];
      if (day.length < 2) {
        day = '0' + day;
      }
      const expDate =
        this.selectedexpirationDate['year'] + '-' + month + '-' + day;
      const data = {
        name: resetForm.legalname.value,
        properties: {
          contractId: resetForm.contractid.value,
          dataType: resetForm.dataType.value,
          expirationDate: expDate,
          originator: resetForm.originator.value,
          exportClassification: resetForm.exportClassification.value,
          personalData: resetForm.personalData.value,
          securityClassification: resetForm.securityClassification.value,
          countryOfOrigin: countries,
        },
        description: resetForm.description.value,
      };

      const passData = {
        name:
          environment.settings.data_partition + '-' + resetForm.legalname.value,
        properties: {
          contractId: resetForm.contractid.value,
          dataType: resetForm.dataType.value,
          expirationDate: expDate,
          originator: resetForm.originator.value,
          exportClassification: resetForm.exportClassification.value,
          personalData: resetForm.personalData.value,
          securityClassification: resetForm.securityClassification.value,
          countryOfOrigin: countries,
        },
        description: resetForm.description.value,
      };
      this.spinner.show();
      this.restService.createLegalTag(data).subscribe(
        (result) => {
          if (typeof result != 'string') {
            this.isSuccess = true;
            this.isError = false;
            this.isNameSpin = false;
            this.isNameChecked = false;
            this.isNameavailable = false;
            this.successMessge =
              'You have successfully created ' +
              resetForm.legalname.value +
              ' legal tag!';
            this.passEntryAdd.emit({ data: passData });
            resetForm.reset();
          }
          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          this.isSuccess = false;
          this.isError = true;
          this.errorMessge = err;
        }
      );
    } else {
      this.isError = true;
      this.isSuccess = false;
      this.errorMessge = 'Please enter all the fields.';
    }

    // this.activeModal.close();
  }

  validateLegalName(val) {
    this.isNameSpin = true;
    this.isNameChecked = false;
    if (val != '') {
      const legal_name = environment.settings.data_partition + '-' + val;
      const data = {
        names: [legal_name],
      };
      this.restService.validateLegalTag(data).subscribe(
        (result) => {
          if (result['invalidLegalTags'].length > 0) {
            if (
              result['invalidLegalTags'][0]['reason'] == 'LegalTag not found'
            ) {
              this.isNameChecked = true;
              this.isNameavailable = true;
            } else {
              this.isNameChecked = true;
              this.isNameavailable = false;
            }
          } else if (result['invalidLegalTags'].length == 0) {
            this.isNameChecked = true;
            this.isNameavailable = false;
          }

          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
          this.isNameChecked = true;
          this.isNameavailable = false;
          console.log(err);
        }
      );
    } else {
      this.isNameChecked = true;
      this.isNameavailable = false;
    }
  }

  onItemSelect(item: any) {
    console.log(item);
    //this.selectedcountryOfOrigin.push(item["item_id"]);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  myFormreset() {
    const resetForm = <HTMLFormElement>document.getElementById('myForm');
    resetForm.reset();
    this.isNameSpin = false;
    this.isNameChecked = false;
  }
}
