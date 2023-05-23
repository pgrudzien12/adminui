import { Component } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AddACLComponent } from '../add-acl/add-acl.component';
import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';

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

  selectAll(value) {
    if (value.currentTarget.checked) {
      for (let obj in this.resultSearchQueryFilter) {
        if (
          !this.selectedObjects.includes(
            this.resultSearchQueryFilter[obj]['id']
          )
        ) {
          this.selectedObjects.push(this.resultSearchQueryFilter[obj]['id']);
        }
      }
    } else {
      for (let obj in this.resultSearchQueryFilter) {
        const index = this.selectedObjects.indexOf(
          this.resultSearchQueryFilter[obj]['id'],
          0
        );
        if (index > -1) {
          this.selectedObjects.splice(index, 1);
        }
      }
    }
  }

  openModalAddACL() {
    this.cmnSrvc.selectedObjects = this.selectedObjects;
    this.modalService.open(AddACLComponent);
  }
}
