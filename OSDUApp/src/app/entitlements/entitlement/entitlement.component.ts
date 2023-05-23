import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { entitlementList } from '../../../config';

@Component({
  selector: 'app-entitlement',
  templateUrl: './entitlement.component.html',
  styleUrls: ['./entitlement.component.css'],
})
export class EntitlementComponent implements OnInit {
  constructor(
    public cmnSrvc: CommonService,
    private restService: RestAPILayerService
  ) {
    this.cmnSrvc.sideNavLists = entitlementList[0]['sideValues'];
    this.cmnSrvc.SideNavHeader = entitlementList[0]['header'];
  }
  UserList = [];

  ngOnInit(): void {
    this.cmnSrvc.sideNavLists = entitlementList[0]['sideValues'];
    this.cmnSrvc.SideNavHeader = entitlementList[0]['header'];
  }

  onTabSelect() {}

  getColor(type) {
    console.log(type);
    return '#00a6de';
  }
}
