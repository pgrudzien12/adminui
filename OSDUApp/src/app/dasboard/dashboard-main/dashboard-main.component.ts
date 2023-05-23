import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common/common.service';
import '../../../config';
import {
  dashboardList,
  managegroups_members_helptext,
  searchdata_helptext,
  workflow_helptext,
  eds_helptext,
  dataloading_helptext,
} from '../../../config';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.css'],
})
export class DashboardMainComponent implements OnInit {
  href;
  id_token = '';
  entitlements_helptext = managegroups_members_helptext;
  searchdata_helptext = searchdata_helptext;
  workflow_helptext = workflow_helptext;
  eds_helptext = eds_helptext;
  dataloading_helptext = dataloading_helptext;

  constructor(
    public restService: RestAPILayerService,
    public router: Router,
    public cmnSrc: CommonService,
    private cd: ChangeDetectorRef
  ) {
    this.cmnSrc.sideNavLists = dashboardList[0]['sideValues'];
    this.cmnSrc.SideNavHeader = dashboardList[0]['header'];
    this.cmnSrc.bkgndColor = 'dashboard';
    this.cmnSrc.bkgndColorDash = '#00a6de';
  }

  ngOnInit(): void {
    this.href = this.router.url;

    this.cmnSrc.sideNavLists = dashboardList[0]['sideValues'];
    this.cmnSrc.SideNavHeader = dashboardList[0]['header'];
    this.cd.detectChanges();
  }

  navigateToWorkFlow() {
    this.router.navigateByUrl('/data-ingestion/workflow');
  }
}
