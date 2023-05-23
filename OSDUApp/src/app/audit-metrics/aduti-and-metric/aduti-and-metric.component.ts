import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { auditmetricList } from 'src/config';

@Component({
  selector: 'app-aduti-and-metric',
  templateUrl: './aduti-and-metric.component.html',
  styleUrls: ['./aduti-and-metric.component.css'],
})
export class AdutiAndMetricComponent implements OnInit {
  constructor(
    public cmnSrvc: CommonService,
    private restService: RestAPILayerService
  ) {
    this.cmnSrvc.sideNavLists = auditmetricList[0]['sideValues'];
    this.cmnSrvc.SideNavHeader = auditmetricList[0]['header'];
    //  this.cmnSrvc.sideNavLists=[{"name":"Test1","router":"profile"},{"name":"Test2","router":"profile"},]
  }

  ngOnInit(): void {
    this.cmnSrvc.sideNavLists = auditmetricList[0]['sideValues'];
    this.cmnSrvc.SideNavHeader = auditmetricList[0]['header'];
    // this.cmnSrvc.sideNavLists=[{"name":"Test1","router":"profile"},{"name":"Test2","router":"profile"},]
  }
}
