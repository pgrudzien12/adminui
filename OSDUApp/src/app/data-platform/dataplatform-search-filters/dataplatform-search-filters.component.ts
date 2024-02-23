import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  search_filterOR2,
  search_filterAND2,
  search_filter_limit,
} from 'src/config';
import { DataPlatformFilterElement } from '../models/data-platform-filter-element.model';
import { Constants } from 'src/app/common/constants.service';

@Component({
  selector: 'app-dataplatform-search-filters',
  templateUrl: './dataplatform-search-filters.component.html',
  styleUrls: ['./dataplatform-search-filters.component.css'],
})
export class DataplatformSearchFiltersComponent {
  readonly tooltipLimit = `${search_filter_limit}`;
  readonly operatorTooltip = `OR: ${search_filterOR2}\n\nAND: ${search_filterAND2}`;
  readonly operators = ['OR', 'AND'];

  fieldValueList: any = [];

  @Input() filtersElements: DataPlatformFilterElement[] = [
    {
      value: null,
      selectedField: null,
    },
  ];

  @Input() baseQuery: string;

  @Output() filtersElementsChange = new EventEmitter<
    DataPlatformFilterElement[]
  >();
  @Output() filterData: EventEmitter<any> = new EventEmitter<any>();
  @Output() clear = new EventEmitter<any>();

  @Input() limit = Constants.requestDefaultLimit;
  @Output() limitChange = new EventEmitter<number>();

  @Input() followingOperators: Array<'OR' | 'AND'> = [];
  @Output() followingOperatorsChange = new EventEmitter<Array<'OR' | 'AND'>>();

  limitList = [5, 25, 100, Constants.maxOSDULimit];

  filtersChanged() {
    this.filtersElementsChange.emit(this.filtersElements);
  }

  limitChanged() {
    this.limitChange.emit(this.limit);
  }

  operatorsChanged() {
    this.followingOperatorsChange.emit([...this.followingOperators]);
  }

  compareLimits(l1: number, l2: number) {
    return l1 == l2;
  }

  addCondition() {
    this.filtersElements.push({
      value: null,
      selectedField: null,
    });
  }

  removeCondition(index: number) {
    this.filtersElements.splice(index, 1);
  }
}

