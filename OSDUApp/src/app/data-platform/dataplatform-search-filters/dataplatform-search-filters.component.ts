import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { OsduObject } from 'src/app/models/osdu-object.model';
import {
  search_filterOR2,
  search_filterAND2,
  search_filter_limit,
} from 'src/config';
import { DataPlatformFilterElement } from '../models/data-platform-filter-element.model';

@Component({
  selector: 'app-dataplatform-search-filters',
  templateUrl: './dataplatform-search-filters.component.html',
  styleUrls: ['./dataplatform-search-filters.component.css'],
})
export class DataplatformSearchFiltersComponent implements OnChanges {
  constructor(private restService: RestAPILayerService) {}

  readonly tooltipLimit = `${search_filter_limit}`;
  readonly operatorTooltip = `OR: ${search_filterOR2}\n\nAND: ${search_filterAND2}`;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.selectedKind) return;

    const data = {
      kind: this.selectedKind,
      limit: 9999,
    };

    this.restService.getDataFromSearch(data).subscribe((result) => {
      this.fullResult.bind(this)(result['results']);
    });
  }

  @Input() filtersElements: DataPlatformFilterElement[] = [
    {
      selectedOperator: 'OR',
      firstValue: null,
      secondValue: null,
      selectedField: null,
    },
    {
      selectedOperator: 'OR',
      firstValue: null,
      secondValue: null,
      selectedField: null,
    },
  ];

  @Output() filtersElementsChange = new EventEmitter<
    DataPlatformFilterElement[]
  >();

  @Input() limit = 10;
  @Output() limitChange = new EventEmitter<number>();

  limitList = ['5', '10', '25', '100'];

  get canValidate() {
    return (
      this.filtersElements.length > 0 && !!this.filtersElements[0].firstValue
    );
  }

  filtersChanged() {
    this.filtersElementsChange.emit([...this.filtersElements]);
  }

  limitChanged() {
    this.limitChange.emit(this.limit);
  }

  operatorsChanged() {
    this.followingOperatorsChange.emit([...this.followingOperators]);
  }

  @Output() filterData: EventEmitter<any> = new EventEmitter<any>();

  @Output() clear = new EventEmitter<any>();

  readonly operators = ['OR', 'AND'];

  @Input() followingOperators: Array<'OR' | 'AND'> = ['OR'];
  @Output() followingOperatorsChange = new EventEmitter<Array<'OR' | 'AND'>>();

  @Input() selectedKind: any;

  wellDetails: OsduObject[] = [];

  fieldValueList: any = [];

  fullResult(result) {
    let tempHeaderList = [];

    let completeResult = result;

    if (completeResult.length > 0) {
      tempHeaderList = [];
      let tempSearchArr = [];
      let tempPassArr = [];

      if (!tempHeaderList.includes('id')) {
        tempHeaderList.push('id');
      }
      completeResult.forEach((element) => {
        if (!tempHeaderList.includes('..Legal Tag')) {
          tempHeaderList.push('.Legal Tag');
        }

        let search_data = element['data'];
        if (search_data != undefined) {
          let headrVals = Object.keys(search_data);
          headrVals.forEach((ele) => {
            if (!tempHeaderList.includes(ele)) {
              tempHeaderList.push(ele);
            }
          });
        }
      });

      completeResult.forEach((element) => {
        let temparr = {};
        let tempPassObject = {};
        let TempWithoutLegal = [];
        temparr[tempHeaderList[0]] = element['id'];
        temparr[tempHeaderList[1]] = element['legal']['legaltags'];
        tempPassObject[tempHeaderList[0]] = element['id'];
        tempPassObject[tempHeaderList[1]] = element['legal']['legaltags'];
        TempWithoutLegal = tempHeaderList.filter((x) => x != '.Legal Tag');
        TempWithoutLegal = TempWithoutLegal.filter((x) => x != '..Id');

        for (let j = 0; j < TempWithoutLegal.length; j++) {
          if (element['data'] != undefined) {
            if (TempWithoutLegal.includes(Object.keys(element['data'])[j])) {
              let obkey = Object.keys(element['data'])[j];
              let res_data = element['data'][obkey];
              tempPassObject[obkey] = res_data;
              if (typeof element['data'][obkey] == 'object') {
                temparr[obkey] = JSON.stringify(res_data);
              } else {
                temparr[obkey] = res_data;
              }
            } else {
              temparr[TempWithoutLegal[j]] = 'NA';
              tempPassObject[TempWithoutLegal[j]] = 'NA';
            }
          } else {
            temparr[TempWithoutLegal[j]] = 'NA';
            tempPassObject[TempWithoutLegal[j]] = 'NA';
          }
        }

        tempSearchArr.push(temparr);
        tempPassArr.push(tempPassObject);
      });

      this.wellDetails = tempPassArr;
    }
  }
}
