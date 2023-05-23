import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';

import { EditLegalTagsComponent } from '../edit-legal-tags/edit-legal-tags.component';
import { AddLegalTagComponent } from '../add-legal-tag/add-legal-tag.component';
import { entitlementList, legat_filter } from '../../../config';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/common/excel.service';
import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';

@Component({
  selector: 'app-legal-tags',
  templateUrl: './legal-tags.component.html',
  styleUrls: ['./legal-tags.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LegalTagsComponent implements OnInit {
  selectedLegalTag = 0;
  dropdownSettings: IDropdownSettings = {};
  legalTagNameList = [];
  legalTagsFullDetails = [];
  trackByIndex = (index) => index;
  selectedLegalTagNames = [];
  headers: [];
  header_properties = [];
  myInput = '';
  pageSize = 10;
  pageSizeWanted = 10;
  pageNum: number;
  page = 1;
  istoggle: boolean = false;
  legat_filter = legat_filter;
  error_Message_Div: string = '';

  constructor(
    private excelService: ExcelService,
    private router: Router,
    private modalService: NgbModal,
    public cmnSrvc: CommonService,
    private restService: RestAPILayerService,
    private spinner: NgxSpinnerService
  ) {
    // this.cmnSrvc.sideNavLists=entitlementList;
    this.cmnSrvc.sideNavLists = entitlementList[0]['sideValues'];
    this.cmnSrvc.SideNavHeader = entitlementList[0]['header'];
    this.cmnSrvc.bkgndColor = 'Manage <wbr>Legal <wbr>Tags';
  }

  LegalTagList = [];
  LegalTagListFull = [];
  currentTag = [];
  ngOnInit(): void {
    this.getLegalTag();
  }

  getLegalTag() {
    this.spinner.show();
    this.restService.getLegalTagList().subscribe(
      (result) => {
        this.error_Message_Div = '';
        this.LegalTagList = result.legalTags;
        this.LegalTagListFull = result.legalTags;
        this.legalTagsFullDetails = result.legalTags;
        let tempList = [];
        result.legalTags.forEach((element) => {
          tempList.push({ item_id: element.name, item_text: element.name });
        });
        this.legalTagNameList = tempList;
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
        let hProp = Object.keys(this.LegalTagList[0].properties);
        let cval = 2;
        hProp.forEach((element) => {
          cval += 1;
          this.header_properties.push({ id: cval, name: element });
        });

        let href = this.router.url;
        if (href.includes('?tags')) {
          this.currentTag.push(href.split('?')[1].split('=')[1]);
          const data = {
            names: this.currentTag,
          };
          this.getMultipleTags(data);
        }

        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        this.error_Message_Div = err;
        console.log(err);
      }
    );
  }

  searchLegalTag() {
    if (this.selectedLegalTagNames.length == 0) {
      this.LegalTagList = this.legalTagsFullDetails;
      this.LegalTagListFull = this.legalTagsFullDetails;
      let hProp = [];
      hProp = Object.keys(this.LegalTagList[0].properties);
      let cval = 2;
      this.header_properties = [];
      hProp.forEach((element) => {
        cval += 1;
        this.header_properties.push({ id: cval, name: element });
      });
    } else {
      let tags = [];
      tags = this.selectedLegalTagNames.map((x) => x.item_id);
      const data = {
        names: tags,
      };
      this.getMultipleTags(data);
    }
  }

  getMultipleTags(data) {
    this.spinner.show();
    this.restService.getLegalTagDetailsMultiple(data).subscribe(
      (result) => {
        this.LegalTagList = result.legalTags;
        this.LegalTagListFull = result.legalTags;
        let hProp = [];
        hProp = Object.keys(this.LegalTagList[0].properties);
        let cval = 2;
        this.header_properties = [];
        hProp.forEach((element) => {
          cval += 1;
          this.header_properties.push({ id: cval, name: element });
        });
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        alert(err);
        console.log(err);
      }
    );
  }

  searchFilter(search) {
    //  this.LegalTagList = this.LegalTagListFull.filter(x=>x["name"].toLowerCase().includes(search));
    this.LegalTagList = this.cmnSrvc.filterByValue(
      this.LegalTagListFull,
      search
    );
  }

  openModal(tags) {
    const modalRef = this.modalService.open(EditLegalTagsComponent);
    modalRef.componentInstance.legalName = tags.name;

    let that = this;
    modalRef.componentInstance.passEntryEdit.subscribe((result) => {
      that.LegalTagList.forEach((element) => {
        if (element.name == result.data.name) {
          element.description = result.data.description;
          element.properties.contractId = result.data.contractId;
          element.properties.expirationDate = result.data.expirationDate;
        }
      });
    });
  }

  openModalCreate() {
    const modalRef = this.modalService.open(AddLegalTagComponent);
    let that = this;
    modalRef.componentInstance.passEntryAdd.subscribe((result) => {
      that.LegalTagList.push({
        name: result.data.name,
        description: result.data.description,
        properties: {
          contractId: result.data.properties.contractId,
          countryOfOrigin: result.data.properties.countryOfOrigin,
          expirationDate: result.data.properties.expirationDate,
          originator: result.data.properties.originator,
          dataType: result.data.properties.dataType,
          securityClassification: result.data.properties.securityClassification,
          personalData: result.data.properties.personalData,
          exportClassification: result.data.properties.exportClassification,
        },
      });
      let tempList = that.legalTagNameList;
      tempList.push({ item_id: result.data.name, item_text: result.data.name });

      this.legalTagNameList = tempList;
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
    });
  }

  deleteFunc(val) {
    let that = this;

    swal
      .fire(
        Helper.warningSweetAlertConfirmConfig(
          'Are you sure you want to delete legal tag ' + val.name
        )
      )
      .then((result) => {
        if (result.isConfirmed) {
          that.restService.deleteLegalTag(val.name).subscribe(
            (result) => {
              if (typeof result != 'string') {
                that.LegalTagList = that.LegalTagList.filter(
                  (x) => x.name != val.name
                );
              }
              that.spinner.hide();
            },
            (err) => {
              that.spinner.hide();

              swal.fire(
                Helper.errorSweetAlertConfig(
                  'Sorry. User is not authorized to perform this action'
                )
              );
              console.log(err);
            }
          );
        }
      });
  }

  sort(colName) {
    if (colName == 'name' || colName == 'description') {
      if (this.istoggle) {
        this.LegalTagList.sort((a, b) =>
          a[colName].toLowerCase() > b[colName].toLowerCase() ? -1 : 1
        );
        this.istoggle = !this.istoggle;
      } else {
        this.LegalTagList.sort((a, b) =>
          a[colName].toLowerCase() < b[colName].toLowerCase() ? -1 : 1
        );
        this.istoggle = !this.istoggle;
      }
    } else {
      if (this.istoggle) {
        if (colName == 'countryOfOrigin') {
          this.LegalTagList.sort((a, b) =>
            a['properties'][colName] > b['properties'][colName] ? -1 : 1
          );
        } else {
          this.LegalTagList.sort((a, b) =>
            a['properties'][colName].toLowerCase() >
            b['properties'][colName].toLowerCase()
              ? -1
              : 1
          );
        }

        this.istoggle = !this.istoggle;
      } else {
        if (colName == 'countryOfOrigin') {
          this.LegalTagList.sort((a, b) =>
            a['properties'][colName] < b['properties'][colName] ? -1 : 1
          );
        } else {
          this.LegalTagList.sort((a, b) =>
            a['properties'][colName].toLowerCase() <
            b['properties'][colName].toLowerCase()
              ? -1
              : 1
          );
        }

        this.istoggle = !this.istoggle;
      }
    }
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  download() {
    let fileName = 'myLegalTagList.csv';
    let columnNames = [
      'name',
      'description',
      'countryOfOrigin',
      'contractId',
      'expirationDate',
      'originator',
      'dataType',
      'securityClassification',
      'personalData',
      'exportClassification',
    ];
    let header = columnNames.join(',');

    let csv = header;
    csv += '\r\n';

    this.LegalTagList.map((c) => {
      csv += [
        c['name'],
        c['description'],
        c['properties']['countryOfOrigin'],
        c['properties']['contractId'],
        c['properties']['expirationDate'],
        c['properties']['originator'],
        c['properties']['dataType'],
        c['properties']['securityClassification'],
        c['properties']['personalData'],
        c['properties']['exportClassification'],
      ].join(',');
      csv += '\r\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  generateExcel() {
    let headers = Object.keys(this.LegalTagListFull[0]);
    let tempHeader = [];
    let tempSubHeader = [];
    headers.forEach((txt) => {
      let x = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      tempHeader.push(x);
    });
    let subHeader = Object.keys(this.LegalTagListFull[0]['properties']);
    subHeader.forEach((txt) => {
      let x = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      tempSubHeader.push(x);
    });
    this.excelService.exportToExcel(
      tempHeader,
      tempSubHeader,
      this.LegalTagListFull
    );
  }

  public pageCalculation(searchList, pageSize) {
    return Math.floor(searchList.length / pageSize + 1);
  }
  public pageSwitch(pageSizeWanted) {
    this.pageSize = pageSizeWanted;
  }
}
