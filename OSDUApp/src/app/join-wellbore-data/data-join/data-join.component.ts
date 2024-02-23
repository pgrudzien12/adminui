import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription, of } from 'rxjs';
import { DataJoinService } from 'src/app/common/data-join.service';

@Component({
  selector: 'app-data-join',
  templateUrl: './data-join.component.html',
  styleUrls: ['./data-join.component.css'],
})
export class DataJoinComponent implements OnInit, OnDestroy {
  wellList: any[] = [];
  wellboreList: any;
  basinList: any;
  organizationList: any;
  fieldList: any;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filterHeaderColumnsList: any[] = [
    { hName: 'h_wellId', frmCtrlName: 'wellId' },
    { hName: 'h_wellboreId', frmCtrlName: 'wellboreId' },
    { hName: 'h_wellboreName', frmCtrlName: 'wellboreName' },
    { hName: 'h_facilityId', frmCtrlName: 'facilityId' },
    { hName: 'h_facilityName', frmCtrlName: 'facilityName' },
    { hName: 'h_basinName', frmCtrlName: 'basinName' },
    { hName: 'h_organizationName', frmCtrlName: 'organizationName' },
    { hName: 'h_fieldName', frmCtrlName: 'fieldName' },
    { hName: 'h_geoPoliticalEntityID', frmCtrlName: 'geoPoliticalEntityID' },
    { hName: 'h_interestType', frmCtrlName: 'interestType' },
    { hName: 'h_operatingEnvId', frmCtrlName: 'operatingEnvId' },
    { hName: 'h_source', frmCtrlName: 'source' },
  ];
  columnsList: any[] = [
    { name: 'Well Id', value: 'wellId' },
    { name: 'Wellbore Id', value: 'wellboreId' },
    { name: 'Wellbore Name', value: 'wellboreName' },
    { name: 'Well FacilityId', value: 'facilityId' },
    { name: 'Well Name', value: 'facilityName', toolTip: 'FacilityName' },
    { name: 'Basin Name', value: 'basinName', toolTip: 'BasinName' },
    {
      name: 'Organization Name',
      value: 'organizationName',
      toolTip: 'OrganisationName',
    },
    { name: 'Field Name', value: 'fieldName', toolTip: 'FieldName' },
    { name: 'GeoPolitcal Entity Id', value: 'geoPoliticalEntityID' },
    {
      name: 'Interest Type Id',
      value: 'interestType',
      toolTip: 'InterestTypeID',
    },
    {
      name: 'Operating Environment Id',
      value: 'operatingEnvId',
      toolTip: 'OperatingEnvironmentID',
    },
    { name: 'Source', value: 'source', toolTip: 'Source' },
    { name: 'Well SpatialLocation.WGS84Coordinates', value: 'spatialLocation' },
    {
      name: 'Wellbore SpatialLocation.WGS84Coordinates',
      value: 'wellboreLocation',
    },
  ];
  filterHeaderColumnsToDisplay: string[] = [
    'h_wellId',
    'h_wellboreId',
    'h_wellboreName',
    'h_facilityName',
    'h_basinName',
    'h_organizationName',
    'h_fieldName',
    'h_geoPoliticalEntityID',
    'h_interestType',
    'h_operatingEnvId',
    'h_source',
  ];
  columnsToDisplay: string[] = [
    'wellId',
    'wellboreId',
    'wellboreName',
    'facilityName',
    'basinName',
    'organizationName',
    'fieldName',
    'geoPoliticalEntityID',
    'interestType',
    'operatingEnvId',
    'source',
    'spatialLocation',
    'wellboreLocation',
  ];
  columnFilterOn: boolean = false;
  filterForm: any = FormGroup;
  filteredFieldNames: Observable<string[]>;
  fieldNames: any;
  filteredWellSources: Observable<string[]>;
  wellSources: any;
  filteredOperatingEnvIds: Observable<string[]>;
  operatingEnvironmentIds: any;
  filteredInteresTypeIds: Observable<string[]>;
  InteresTypeIds: any;
  filteredOrganizationNames: Observable<string[]>;
  OrganizationNames: any;
  filteredBasinNames: Observable<string[]>;
  BasinNames: any;
  rowColor: string = '';
  rowColorArr: any[] = [];
  sub: Subscription;
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private mergeDataSvc: DataJoinService
  ) {}

  ngOnInit(): void {
    localStorage.setItem('isNavigateFromMergeData', 'false');
    this.spinner.show();
    this.mergeDataSvc.getMergedData();
    this.sub = this.mergeDataSvc.mergedData.subscribe((data) => {
      if (data && data.length > 0) {
        this.setTableData(data);
      }
    });
    this.filterForm = new FormGroup({
      wellId: new FormControl(''),
      wellboreId: new FormControl(''),
      wellboreName: new FormControl(''),
      facilityId: new FormControl(''),
      facilityName: new FormControl(''),
      basinName: new FormControl(''),
      organizationName: new FormControl(''),
      fieldName: new FormControl(''),
      geoPoliticalEntityID: new FormControl(''),
      interestType: new FormControl(''),
      operatingEnvId: new FormControl(''),
      source: new FormControl(''),
      filterOn: new FormControl(false),
    });
    this.filterForm.valueChanges.subscribe((res: any) => {
      res.wellId = res.wellId.toLowerCase();
      res.wellboreId = res.wellboreId.toLowerCase();
      res.wellboreName = res.wellboreName.toLowerCase();
      res.facilityId = res.facilityId.toLowerCase();
      res.facilityName = res.facilityName.toLowerCase();
      res.basinName = res.basinName.toLowerCase();
      res.organizationName = res.organizationName.toLowerCase();
      res.fieldName = res.fieldName.toLowerCase();
      res.geoPoliticalEntityID = res.geoPoliticalEntityID.toLowerCase();
      res.interestType = res.interestType.toLowerCase();
      res.operatingEnvId = res.operatingEnvId.toLowerCase();
      res.source = res.source.toLowerCase();
      this.filteredFieldNames = of(this._filterFieldNames(res.fieldName));
      this.filteredWellSources = of(this._filterWellSources(res.source));
      this.filteredOperatingEnvIds = of(
        this._filterOperatingEnvIds(res.operatingEnvId)
      );
      this.filteredInteresTypeIds = of(
        this._filterInteresTypeIds(res.interestType)
      );
      this.filteredOrganizationNames = of(
        this._filterOrganizationNames(res.organizationName)
      );
      this.filteredBasinNames = of(this._filterBasinNames(res.basinName));
      this.dataSource.filter = JSON.stringify(res);
    });
  }

  getObjectParentString(element: any, key: string) {
    return `${element} > ${key}`;
  }

  setTableData(data) {
    this.fieldNames = [...new Set(data.map((item) => item.fieldName))];
    this.wellSources = [...new Set(data.map((item) => item.source))];
    this.operatingEnvironmentIds = [
      ...new Set(data.map((item) => item.operatingEnvId)),
    ];
    this.InteresTypeIds = [...new Set(data.map((item) => item.interestType))];
    this.OrganizationNames = [
      ...new Set(data.map((item) => item.organizationName)),
    ];
    this.BasinNames = [...new Set(data.map((item) => item.basinName))];
    this.setRowColor(data);
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.customFilter;
    this.spinner.hide();
  }

  filterToggle() {
    this.columnFilterOn = !this.columnFilterOn;
    this.filterForm.controls.filterOn.setValue(this.columnFilterOn);
  }

  customFilter = (data: any, filter: string) => {
    const filterData = JSON.parse(filter);
    let ok: boolean = true;
    if (!filterData.filterOn) return true;
    if (filterData.wellId)
      ok = data.wellId.toLowerCase().indexOf(filterData.wellId) >= 0;
    if (filterData.wellboreId)
      ok =
        ok && data.wellboreId.toLowerCase().indexOf(filterData.wellboreId) >= 0;
    if (filterData.wellboreName)
      ok =
        ok &&
        data.wellboreName.toLowerCase().indexOf(filterData.wellboreName) >= 0;
    if (filterData.facilityId)
      ok =
        ok && data.facilityId.toLowerCase().indexOf(filterData.facilityId) >= 0;
    if (filterData.facilityName)
      ok =
        ok &&
        data.facilityName.toLowerCase().indexOf(filterData.facilityName) >= 0;
    if (filterData.basinName)
      ok =
        ok && data.basinName.toLowerCase().indexOf(filterData.basinName) >= 0;
    if (filterData.organizationName)
      ok =
        ok &&
        data.organizationName
          .toLowerCase()
          .indexOf(filterData.organizationName) >= 0;
    if (filterData.fieldName)
      ok =
        ok && data.fieldName.toLowerCase().indexOf(filterData.fieldName) >= 0;
    if (filterData.geoPoliticalEntityID)
      ok =
        ok &&
        data.geoPoliticalEntityID
          .toLowerCase()
          .indexOf(filterData.geoPoliticalEntityID) >= 0;
    if (filterData.interestType)
      ok =
        ok &&
        data.interestType.toLowerCase().indexOf(filterData.interestType) >= 0;
    if (filterData.operatingEnvId)
      ok =
        ok &&
        data.operatingEnvId.toLowerCase().indexOf(filterData.operatingEnvId) >=
          0;
    if (filterData.source)
      ok = ok && data.source.toLowerCase().indexOf(filterData.source) >= 0;
    return ok;
  };

  navigate(id) {
    this.router.navigate(['/object-view', id]);
  }

  private _filterFieldNames(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.fieldNames?.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private _filterWellSources(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.wellSources?.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private _filterOperatingEnvIds(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.operatingEnvironmentIds?.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private _filterInteresTypeIds(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.InteresTypeIds?.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private _filterOrganizationNames(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.OrganizationNames?.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private _filterBasinNames(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.BasinNames?.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  setRowColor(data) {
    let res;
    [...new Set(data.map((item) => item.wellId))].forEach((id) => {
      res = {
        id,
        color: (this.rowColor =
          this.rowColor == 'background-color: rgba(0, 0, 0, 0)'
            ? 'strippedRow'
            : 'background-color: rgba(0, 0, 0, 0)'),
      };
      this.rowColorArr.push(res);
    });
  }

  getRowColor(row) {
    return this.rowColorArr.filter((itm) => itm.id == row.wellId)[0].color;
  }

  navigateToMap() {
    this.mergeDataSvc.mergeData = this.dataSource.filteredData;
    localStorage.setItem('isNavigateFromMergeData', 'true');
    this.router.navigate(['/map']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
