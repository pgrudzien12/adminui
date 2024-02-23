import { Injectable } from '@angular/core';
import { RestAPILayerService } from './rest-apilayer.service';
import { Subject, forkJoin } from 'rxjs';
import { CommonService } from './common.service';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';
import { Helper } from './helper.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { wellboreAliasName } from 'src/config';

@Injectable({
  providedIn: 'root',
})
export class DataJoinService {
  wellList: any[] = [];
  wellboreList: any;
  basinList: any;
  organizationList: any;
  fieldList: any;
  mergeData: any[] = [];
  public mergedData: Subject<any[]> = new Subject<any[]>();

  constructor(
    private restService: RestAPILayerService,
    private cmnSrvc: CommonService,
    private spinner: NgxSpinnerService
  ) {}

  getMergedData() {
    forkJoin([
      this.restService.getDataFromSearch({
        kind: 'osdu:wks:master-data--Well:*',
        limit: 9999,
      }),
      this.restService.getDataFromSearch({
        kind: 'osdu:wks:master-data--Wellbore:*',
        limit: 9999,
      }),
      this.restService.getDataFromSearch({
        kind: 'osdu:wks:master-data--Basin:*',
        limit: 9999,
      }),
      this.restService.getDataFromSearch({
        kind: 'osdu:wks:master-data--Organisation:*',
        limit: 9999,
      }),
      this.restService.getDataFromSearch({
        kind: 'osdu:wks:master-data--Field:*',
        limit: 9999,
      }),
    ]).subscribe(
      (responses) => {
        this.mergeResponses(responses);
      },
      (err) => {
        this.spinner.hide();
        swal.fire(Helper.errorSweetAlertConfig(err));
      }
    );
  }

  mergeResponses(responses) {
    let temp;
    this.wellList = responses[0]['results'];
    this.wellboreList = responses[1]['results'];
    this.basinList = responses[2]['results'];
    this.organizationList = responses[3]['results'];
    this.fieldList = responses[4]['results'];
    let res = [];
    this.wellList.map((element) => {
      this.wellboreList.forEach((o) => {
        let wellborewellid =
          o.data.WellID === null
            ? o.data.WellID
            : o.data.WellID.replace(/:$/, '');
        if (element.id === wellborewellid) {
          temp = {
            wellId: this.cmnSrvc.cleanAttributeID(element.id),
            basinId: element.data['GeoContexts']
              ? this.getBasinID(element.data['GeoContexts'])
              : null,
            geoPoliticalEntityID: element.data['GeoContexts']
              ? this.getGeoPoliticalEntityID(element.data['GeoContexts'])
                  .geoPoliticalEntityID
              : '  ',
            geoPoliticalFullID: element.data['GeoContexts']
              ? this.getGeoPoliticalEntityID(element.data['GeoContexts'])
                  .geoPoliticalFullID
              : '',
            currentOperatorID: element.data.CurrentOperatorID,
            facilityId: element.data.FacilityID ? element.data.FacilityID : ' ',
            facilityName: element.data.FacilityName
              ? element.data.FacilityName
              : '',
            interestType: element.data.InterestTypeID
              ? this.cmnSrvc.cleanAttributeID(element.data.InterestTypeID)
              : '  ',
            operatingEnvId: element.data.OperatingEnvironmentID
              ? this.cmnSrvc.cleanAttributeID(
                  element.data.OperatingEnvironmentID
                )
              : '  ',
            source: element.data.Source ? element.data.Source : '  ',
            spatialLocation: element.data['SpatialLocation.Wgs84Coordinates'],
            wellboreId: this.cmnSrvc.cleanAttributeID(o.id),
            wellboreName: o.data.NameAliases
              ? this.getWellboreName(o.data.NameAliases)
              : '  ',
            wellboreLocation: o.data['SpatialLocation.Wgs84Coordinates'],
            wellboreFieldId: o.data['GeoContexts']
              ? this.getFieldId(o.data['GeoContexts'])
              : null,
          };
          res.push(temp);
        }
      });
    });
    res.forEach((obj) => {
      let tempBasinId =
        obj.basinId === null ? obj.basinId : obj.basinId.replace(/:$/, '');
      const ele = this.basinList.find((o) => o.id == tempBasinId);
      if (ele) {
        obj.basinName = ele.data['BasinName'];
      } else {
        obj.basinName = '  ';
      }
    });
    res.forEach((obj) => {
      let tempCurrentOperatorID =
        obj.currentOperatorID === null
          ? obj.currentOperatorID
          : obj.currentOperatorID.replace(/:$/, '');
      const ele = this.organizationList.find(
        (o) => o.id == tempCurrentOperatorID
      );
      if (ele) {
        obj.organizationName = ele.data['OrganisationName'];
      } else {
        obj.organizationName = '  ';
      }
    });
    res.forEach((obj) => {
      let tempFieldId =
        obj.wellboreFieldId === null
          ? obj.wellboreFieldId
          : obj.wellboreFieldId.replace(/:$/, '');
      const ele = this.fieldList.find((o) => o.id == tempFieldId);
      if (ele) {
        obj.fieldName = ele.data['FieldName'];
      } else {
        obj.fieldName = '  ';
      }
    });
    this.mergeData = res;
    this.mergedData.next(res);
  }

  getWellboreName(NameAliases): string {
    let wellboreName = '  ';
    if (NameAliases.length > 0) {
      NameAliases.forEach((obj) => {
        if (
          obj.AliasNameTypeID ==
          environment.settings.data_partition +
            ':reference-data--AliasNameType:' +
            wellboreAliasName +
            ':'
        ) {
          wellboreName = obj.AliasName;
        }
      });
    }
    return wellboreName;
  }

  getGeoPoliticalEntityID(data): any {
    let geoPoliticalEntityID,
      geoPoliticalFullID = '';
    if (data && data.length > 0) {
      data.forEach((itm) => {
        if (itm.GeoPoliticalEntityID) {
          geoPoliticalEntityID = this.cmnSrvc.cleanAttributeID(
            itm.GeoPoliticalEntityID
          );
          geoPoliticalFullID = itm.GeoPoliticalEntityID;
        }
      });
    }
    return { geoPoliticalEntityID, geoPoliticalFullID };
  }

  getBasinID(data): string {
    let basinId = '';
    if (data && data.length > 0) {
      data.forEach((itm) => {
        if (itm.BasinID) {
          basinId = itm.BasinID;
        }
      });
    }
    return basinId;
  }

  getFieldId(data): string {
    let wellboreFieldId = '';
    if (data && data.length > 0) {
      data.forEach((itm) => {
        if (itm.FieldID) {
          wellboreFieldId = itm.FieldID;
        }
      });
    }
    return wellboreFieldId;
  }
}
