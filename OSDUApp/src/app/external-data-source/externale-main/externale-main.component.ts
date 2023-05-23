import { Component, ViewEncapsulation } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';

@Component({
  selector: 'app-externale-main',
  templateUrl: './externale-main.component.html',
  styleUrls: ['./externale-main.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ExternaleMainComponent {
  constructor(private cmnSrc: CommonService) {
    this.cmnSrc.bkgndColor = 'eds';
  }
}
