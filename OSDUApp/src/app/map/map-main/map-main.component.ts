import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OsduObject } from 'src/app/models/osdu-object.model';
import { Constants } from 'src/app/common/constants.service';
import { DataPlatformFilterElement } from 'src/app/data-platform/models/data-platform-filter-element.model';
import { Helper } from 'src/app/common/helper.service';
import { LeafletMapComponent } from '../components/leaflet-map/leaflet-map.component';

@Component({
  selector: 'app-map-main',
  templateUrl: './map-main.component.html',
  styleUrls: ['./map-main.component.css'],
})
export class MapMainComponent implements OnInit, AfterViewInit {
  @ViewChild('actionRef') actionRef: TemplateRef<any>;

  @ViewChild('leafletMap') leafletMap: LeafletMapComponent;

  length = 0;

  osduObjects: OsduObject[] = null;

  templateColumns = [];

  limit = Constants.requestDefaultLimit;

  followingOperators: Array<'OR' | 'AND'> = [];
  filtersElements: DataPlatformFilterElement[] = [
    {
      value: null,
      selectedField: null,
    },
  ];

  constructor(
    public cmnSrvc: CommonService,
    private restService: RestAPILayerService,
    private spinner: NgxSpinnerService
  ) {
    this.cmnSrvc.bkgndColor = 'Maps';
    this.getLocalStorageFilters();
  }

  ngOnInit(): void {
    this.completeMapWithWells();
  }

  getLocalStorageFilters() {
    if (localStorage.getItem(Constants.filtersElementStorageKey)) {
      this.filtersElements = JSON.parse(
        localStorage.getItem(Constants.filtersElementStorageKey)
      );
      localStorage.removeItem(Constants.filtersElementStorageKey);
    }

    if (localStorage.getItem(Constants.followingOperatorsStorageKey)) {
      this.followingOperators = JSON.parse(
        localStorage.getItem(Constants.followingOperatorsStorageKey)
      );
      localStorage.removeItem(Constants.followingOperatorsStorageKey);
    }
  }

  ngAfterViewInit(): void {
    this.templateColumns = [
      {
        name: '',
        id: 'actions',
        templateRef: this.actionRef,
      },
    ];
  }

  completeMapWithWells() {
    this.spinner.show();
    const data = {
      kind: 'osdu:wks:master-data--Well:*',
      limit: this.limit,
      query: Helper.getQueryStringFromFiltersElements(
        this.filtersElements,
        this.followingOperators
      ),
    };
    this.restService.getDataFromSearch(data).subscribe(
      (result) => {
        this.length = result?.totalCount;
        if (result?.results) {
          this.osduObjects = result.results;
          this.spinner.hide();
          return;
        }
        this.osduObjects = [];
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  clearFilters() {
    this.filtersElements = [
      {
        value: null,
        selectedField: null,
      },
    ];

    this.completeMapWithWells();
  }

  showOnMap(osduObject: OsduObject) {
    this.leafletMap.flyToObject(osduObject);
  }

  isShownOnMap(osduObject: OsduObject) {
    return Helper.isShownOnMap(osduObject);
  }
}
