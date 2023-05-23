import { Component, ViewEncapsulation } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';

@Component({
  selector: 'app-data-ingestion',
  templateUrl: './data-ingestion.component.html',
  styleUrls: ['./data-ingestion.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DataIngestionComponent {
  constructor(public cmnSrc: CommonService) {
    this.cmnSrc.bkgndColor = 'workflow';
  }
}
