import { Component, Input, OnInit } from '@angular/core';
import { search_filter_limit } from 'src/config';

@Component({
  selector: 'app-spatial-filters',
  templateUrl: './spatial-filters.component.html',
  styleUrls: ['./spatial-filters.component.css'],
})
export class SpatialFiltersComponent implements OnInit {
  ngLimit = 0;
  ngselectedField;
  ngselectedFieldValue;

  isError: boolean = false;
  limitList = [];
  fieldValueList = [];
  errorMessge = '';

  @Input() searchObjectArr: any;
  @Input() selectedKind: any;
  @Input() wellDetails: any;

  search_filter_limit = search_filter_limit;
  wellFullDetails: any;

  ngOnInit(): void {
    for (let index = 1; index <= 10; index++) {
      const val = 10 * index;
      this.limitList.push(val);
    }
    if (this.wellFullDetails == undefined) {
      this.wellFullDetails = this.wellDetails;
    }
  }

  requestSubmit() {}

  resetForm() {}

  populateKindValues(val) {
    this.fieldValueList = [];
    this.wellFullDetails.forEach((element) => {
      let headKEy = Object.keys(element);
      headKEy.forEach((ele) => {
        if (ele == val) {
          if (element[ele] != 'NA') {
            if (!this.fieldValueList.includes(element[ele])) {
              this.fieldValueList.push(element[ele]);
            }
          }
        }
      });
    });
  }
}
