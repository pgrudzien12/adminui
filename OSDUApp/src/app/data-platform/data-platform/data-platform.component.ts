import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OsduObject } from 'src/app/models/osdu-object.model';

import { DataPlatformFilterData } from '../models/data-platform-filter-data.model';
import { DataPlatformFilterElement } from '../models/data-platform-filter-element.model';
import { Helper } from 'src/app/common/helper.service';
import { Constants } from 'src/app/common/constants.service';

const defaultFiltersElements = [
  {
    firstValue: null,
    selectedField: null,
  },
];

@Component({
  selector: 'app-data-platform',
  templateUrl: './data-platform.component.html',
  styleUrls: ['./data-platform.component.css'],
})
export class DataPlatformComponent implements OnInit {
  filtersElements: DataPlatformFilterElement[] = JSON.parse(
    JSON.stringify(defaultFiltersElements)
  );

  @Input() baseQuery = null;
  @Input() templateColumns = [];
  @Input() selectable = false;
  @Input() selectActionsTemplate: TemplateRef<any>;
  @Input() canSelect: (osduObject: OsduObject) => boolean = () => true;

  objectList: OsduObject[] = [];

  limit = Constants.requestDefaultLimit;
  length = 0;

  followingOperators = ['OR'];

  originalOrder = (): number => {
    return 0;
  };

  isWellSearchAvailable: boolean = false;

  storageKindList = [];
  isUserOwned: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restService: RestAPILayerService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.isUserOwned = params.isUserOwned === 'true';
      if (params.limit) this.limit = params.limit;
      const filters = JSON.parse(params.filtersElements ?? '[]');
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
      !filters[0].value
    );
  }

  launchSearch() {
    const urlTree = this.router.parseUrl(this.router.url);
    const urlWithoutParams = urlTree.root.children['primary'].segments
      .map((it) => it.path)
      .join('/');

    this.router.navigate([urlWithoutParams], {
      queryParams: {
        filtersElements: JSON.stringify(this.filtersElements),
        limit: this.limit,
        followingOperators: JSON.stringify(this.followingOperators),
        isUserOwned: this.isUserOwned,
      },
      queryParamsHandling: 'merge',
    });
  }

  private searchWithoutFilters() {
    this.isWellSearchAvailable = true;
    this.spinner.show();
    this.filtersElements = JSON.parse(JSON.stringify(defaultFiltersElements));
    const data = {
      limit: this.limit,
      ...this.baseQuery,
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

    this.restService.getDataFromSearch(data).subscribe(
      (result) => {
        this.spinner.hide();
        this.objectList = result['results'];
      },
      () => {
        this.spinner.hide();
      }
    );

    this.getLengthOfSearch(data);
  }

  private getLengthOfSearch(data: DataPlatformFilterData) {
    this.restService
      .getDataFromSearch({ ...data, limit: 1 }, true)
      .subscribe((res) => {
        this.length = res.totalCount;
      });
  }

  private searchWithFilters() {
    const data = { ...this.baseQuery };

    const queryFilters = Helper.getQueryStringFromFiltersElements(
      this.filtersElements,
      this.followingOperators
    );

    const queryArray = [];
    if (data.query) queryArray.push(`(${data.query})`);
    if (queryFilters) queryArray.push(`(${queryFilters})`);

    this.getSearchResults({
      ...data,
      query: queryArray.join(' AND '),
      limit: this.limit,
    });
  }

  openModalObjectView(objId) {
    this.router.navigate(['/object-view', objId.value]);
  }

  userOwnedSearch() {
    this.launchSearch();
  }
}
