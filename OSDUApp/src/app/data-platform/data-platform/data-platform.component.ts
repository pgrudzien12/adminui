import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OsduObject } from 'src/app/models/osdu-object.model';

import { DataPlatformFilterData } from '../models/data-platform-filter-data.model';
import { OsduKind } from 'src/app/models/osdu-kind.model';
import { DataPlatformFilterElement } from '../models/data-platform-filter-element.model';

const defaultFiltersElements = [
  {
    selectedOperator: 'OR',
    firstValue: null,
    secondValue: null,
    selectedField: null,
  },
  {
    selectedOperator: 'OR',
    firstValue: null,
    secondValue: null,
    selectedField: null,
  },
];

@Component({
  selector: 'app-data-platform',
  templateUrl: './data-platform.component.html',
  styleUrls: ['./data-platform.component.css'],
})
export class DataPlatformComponent implements OnInit {
  selectedStorageKind: OsduKind = null;

  filtersElements: DataPlatformFilterElement[] = JSON.parse(
    JSON.stringify(defaultFiltersElements)
  );

  objectList: OsduObject[] = [];

  limit = 10;

  followingOperators = ['OR'];

  originalOrder = (): number => {
    return 0;
  };

  isWellSearchAvailable: boolean = false;

  storageKindList = [];
  selectedStorageKindId: string;
  isDisabled: boolean = false;
  isUserOwned: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cmnSrvc: CommonService,
    private restService: RestAPILayerService,
    private spinner: NgxSpinnerService
  ) {
    this.cmnSrvc.isUserGuide = true;
    this.cmnSrvc.bkgndColor = 'dataPlatform';
  }

  ngOnInit(): void {
    this.cmnSrvc.isUserGuide = true;
    this.cmnSrvc.bkgndColor = 'dataPlatform';

    this.route.queryParams.subscribe((params) => {
      if (
        !params.selectedStorageKind ||
        !JSON.parse(params.selectedStorageKind)
      ) {
        this.selectedStorageKind = null;
        this.selectedStorageKindId = null;
        this.filtersElements = JSON.parse(
          JSON.stringify(defaultFiltersElements)
        );
        return;
      }
      this.isUserOwned = params.isUserOwned === 'true';
      this.limit = params.limit ?? 10;
      this.selectedStorageKind = JSON.parse(params.selectedStorageKind);
      this.selectedStorageKindId = this.selectedStorageKind.schemaIdentity.id;

      const filters = JSON.parse(params.filtersElements);
      if (this.isFiltersEmpty(filters)) {
        this.searchWithoutFilters();
        return;
      }

      this.filtersElements = filters;
      this.followingOperators = JSON.parse(params.followingOperators);

      this.searchWithFilters();
    });
  }

  clearFilters() {
    this.filtersElements = JSON.parse(JSON.stringify(defaultFiltersElements));
    this.launchSearch();
  }

  private isFiltersEmpty(filters: DataPlatformFilterElement[]) {
    return (
      !filters ||
      filters.length === 0 ||
      !filters[0].selectedField ||
      !filters[0].firstValue
    );
  }

  launchSearch() {
    this.router.navigate(['/data-platform'], {
      queryParams: {
        selectedStorageKind: JSON.stringify(this.selectedStorageKind),
        filtersElements: JSON.stringify(this.filtersElements),
        limit: this.limit,
        followingOperators: JSON.stringify(this.followingOperators),
        isUserOwned: this.isUserOwned,
      },
    });
  }

  private searchWithoutFilters() {
    this.isWellSearchAvailable = true;
    this.spinner.show();
    this.filtersElements = JSON.parse(JSON.stringify(defaultFiltersElements));
    const data = {
      kind: this.selectedStorageKindId,
      limit: 99999,
    };
    this.getSearchResults(data);
  }

  selectedKindChange() {
    this.filtersElements = JSON.parse(JSON.stringify(defaultFiltersElements));
    this.launchSearch();
  }

  private getSearchResults(data: DataPlatformFilterData) {
    this.spinner.show();
    data.queryAsOwner = this.isUserOwned;
    data.kind = this.selectedStorageKindId;

    this.restService.getDataFromSearch(data).subscribe(
      (result) => {
        this.spinner.hide();
        this.objectList = result['results'];
      },
      (err) => {
        this.spinner.hide();
        this.isDisabled = false;
        console.log(err);
      }
    );
  }

  private searchElement(field: string, value: string): string {
    if (field !== 'id') return `data.${field}:("${value}")`;
    return `data.${field}=("${value}")`;
  }

  private searchWithFilters() {
    const elements = this.filtersElements
      .filter((el) => !!el.firstValue && !!el.selectedField)
      .map((el) => {
        if (el.secondValue) {
          return `(${this.searchElement(el.selectedField, el.firstValue)}) ${
            el.selectedOperator
          } (${this.searchElement(el.selectedField, el.firstValue)})`;
        }

        return this.searchElement(el.selectedField, el.firstValue);
      });

    if (elements.length === 0) {
      this.getSearchResults({
        query: '',
        limit: this.limit,
      });
      return;
    }

    let queryString = elements[0];

    this.followingOperators.forEach((op, index) => {
      const followingElement = elements[index + 1];
      if (!followingElement) return;

      queryString = `${queryString} ${op} ${followingElement}`;
    });

    this.getSearchResults({
      query: queryString,
      limit: this.limit,
    });
  }

  openModalLegalTags(legal) {
    this.router.navigate(['/legal-tags'], {
      queryParams: { tags: legal.value },
    });
  }

  openModalObjectView(objId) {
    this.router.navigate(['/object-view', objId.value]);
  }

  userOwnedSearch() {
    this.launchSearch();
  }
}
