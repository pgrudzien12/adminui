import { Component, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AddACLComponent } from '../add-acl/add-acl.component';
import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';
// import { forEach } from 'jszip';

@Component({
  selector: 'app-search-query',
  templateUrl: './search-query.component.html',
  styleUrls: ['./search-query.component.css'],
})
export class SearchQueryComponent {
  myInput;
  modalOptions: NgbModalOptions;
  resultSearchQuery = [];
  resultSearchQueryFilter = [];
  searchQueryRequest;
  resultSearchQueryCount = 0;
  selectedObjects = [];
  AllSelector: boolean = false;
  loading: boolean = true;

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  readonly displayedColumns = ['select', 'id', 'kind', 'version'];

  constructor(
    private router: Router,
    private modalService: NgbModal,
    public cmnSrvc: CommonService,
    private restService: RestAPILayerService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };
    this.cmnSrvc.bkgndColor = 'SearchQuery';

    this.route.queryParams.subscribe((params) => {
      if (!params.searchQueryRequest) return;

      this.searchQueryRequest = params.searchQueryRequest;

      this.searchQuery(this.searchQueryRequest);
    });
  }

  launchSearch() {
    this.router.navigate(['/search-query'], {
      queryParams: {
        searchQueryRequest: this.searchQueryRequest,
      },
    });
  }

  searchQuery(search) {
    this.loading = true;
    this.cmnSrvc.searchQuery = search;
    const data = {
      kind: '*:*:*:*',
      query: search,
      returnedFields: ['id', 'version', 'kind', 'data'],
      limit: 9999,
    };

    this.spinner.show();

    this.restService.getDataFromSearch(data).subscribe(
      (resultSearchQuery) => {
        this.resultSearchQuery = resultSearchQuery['results'];
        this.resultSearchQueryFilter = resultSearchQuery['results'];
        this.resultSearchQueryCount = resultSearchQuery['results'].length;

        this.dataSource.data = this.resultSearchQuery;
        this.dataSource.sort = this.sort;
        console.log(this.paginator);
        this.paginator.length = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;

        console.log(this.resultSearchQuery);
        this.spinner.hide();
        this.loading = false;
      },
      (err) => {
        swal.fire(Helper.errorSweetAlertConfig(err));
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  openModalObjectView(objId) {
    this.router.navigate(['/object-view', objId]);
  }

  searchFilter(search) {
    this.resultSearchQueryFilter = this.cmnSrvc.filterByValue(
      this.resultSearchQuery,
      search
    );
    this.dataSource.data = this.resultSearchQueryFilter;
    this.resultSearchQueryCount = this.resultSearchQueryFilter.length;
    this.AllSelector = false;
  }

  ObjectInSelect(objectID) {
    return this.selectedObjects.includes(objectID);
  }

  addObjectToSelect(value, objectID) {
    if (value.currentTarget.checked) {
      if (!this.selectedObjects.includes(objectID)) {
        this.selectedObjects.push(objectID);
      }
    } else {
      const index = this.selectedObjects.indexOf(objectID, 0);
      if (index > -1) {
        this.selectedObjects.splice(index, 1);
      }
    }
  }

  selectAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.resultSearchQueryFilter.forEach((element) =>
        this.selectedObjects.push(element.id)
      );
    } else {
      this.selectedObjects = [];
    }
  }

  selectRow(event: MatCheckboxChange, elementID) {
    if (event.checked) {
      if (!this.selectedObjects.includes(elementID)) {
        this.selectedObjects.push(elementID);
      }
    } else {
      const index = this.selectedObjects.indexOf(elementID, 0);
      if (index > -1) {
        this.selectedObjects.splice(index, 1);
      }
    }
  }

  openModalAddACL() {
    this.cmnSrvc.selectedObjects = this.selectedObjects;
    this.modalService.open(AddACLComponent);
  }
}
