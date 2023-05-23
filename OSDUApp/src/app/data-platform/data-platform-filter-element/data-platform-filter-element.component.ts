import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { OsduObject } from 'src/app/models/osdu-object.model';
import { of } from 'rxjs';
import { DataPlatformFilterElement } from '../models/data-platform-filter-element.model';
import { search_filterOR1, search_filterAND1 } from 'src/config';
@Component({
  selector: 'app-data-platform-filter-element',
  templateUrl: './data-platform-filter-element.component.html',
  styleUrls: ['./data-platform-filter-element.component.css'],
})
export class DataPlatformFilterElementComponent implements OnInit {
  @Input() fullResult: OsduObject[] = [];

  fields: string[] = [];

  @Input() filters: DataPlatformFilterElement = {
    selectedOperator: 'OR',
    firstValue: null,
    secondValue: null,
    selectedField: null,
  };

  @Output() filtersChange = new EventEmitter<DataPlatformFilterElement>();

  readonly operators = ['OR', 'AND'];

  readonly tooltipContent = `OR: ${search_filterOR1}\n\nAND: ${search_filterAND1}`;

  ngOnInit() {
    if (this.fullResult.length === 0) return;
    this.getFields();
  }

  emitFilersChange(type = 'none') {
    if (type === 'firstValue') {
      this.filters = {
        selectedOperator: 'OR',
        firstValue: null,
        secondValue: null,
        selectedField: this.filters.selectedField,
      };
    }

    this.filtersChange.emit({ ...this.filters });
  }

  getFields() {
    const element = this.fullResult[0];

    const resultFields = Object.keys(element).filter(
      (f) => f !== '..Legal Tag' && f !== '.Id'
    );

    const filterdFieldSet = new Set<string>();

    resultFields.forEach((rField) => {
      if (typeof element[rField] === 'string') {
        filterdFieldSet.add(rField);
        return;
      }

      if (
        this.isSpacialLocation(element, rField) &&
        element[rField].length > 0
      ) {
        element[rField].forEach((s) => filterdFieldSet.add(s));
      }
    });

    this.fields = Array.from(filterdFieldSet);
  }

  displayFn(element: string) {
    return element;
  }

  getSuggestions(search) {
    if (typeof search !== 'string') return of([]);

    const resultSet = new Set<string>();

    this.fullResult.forEach((element) => {
      const elementField = element[this.filters.selectedField];
      if (!elementField) return;

      if (
        typeof elementField === 'string' &&
        elementField.toLowerCase().includes(search.toLowerCase())
      )
        resultSet.add(elementField);
    });

    return of(Array.from(resultSet));
  }

  private isSpacialLocation(element: OsduObject, field: string) {
    return typeof element[field] === 'object' && field === 'SpatialLocation';
  }
}
