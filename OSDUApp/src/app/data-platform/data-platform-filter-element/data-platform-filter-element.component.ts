import { Component, Input, EventEmitter, Output } from '@angular/core';
import { OsduObject } from 'src/app/models/osdu-object.model';
import { of } from 'rxjs';
import { DataPlatformFilterElement } from '../models/data-platform-filter-element.model';
import { search_filterOR1, search_filterAND1 } from 'src/config';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { catchError, map } from 'rxjs/operators';
import { Constants } from 'src/app/common/constants.service';
import { Helper } from 'src/app/common/helper.service';
@Component({
  selector: 'app-data-platform-filter-element',
  templateUrl: './data-platform-filter-element.component.html',
  styleUrls: ['./data-platform-filter-element.component.css'],
})
export class DataPlatformFilterElementComponent {
  @Input() baseQuery = null;

  readonly fields: string[] = [
    'kind',
    'data.FacilityName',
    'data.WellboreID',
    'data.WellID',
    'data.ExistenceKind',
    'data.Source',
    'data.Name',
  ].sort();

  @Input() filters: DataPlatformFilterElement = {
    value: null,
    selectedField: null,
  };

  @Output() filtersChange = new EventEmitter<DataPlatformFilterElement>();

  readonly operators = ['OR', 'AND'];

  readonly tooltipContent = `OR: ${search_filterOR1}\n\nAND: ${search_filterAND1}`;

  constructor(private restAPIService: RestAPILayerService) {}

  emitFilersChange() {
    this.filtersChange.emit(this.filters);
  }

  selectedFieldChange(filter) {
    this.filters.selectedField = filter;
    this.filters.value = null;
    this.emitFilersChange();
  }

  fieldValueChange(value: string) {
    this.filters.value = value;
    this.emitFilersChange();
  }

  displayFn(element: string) {
    return element;
  }

  getSuggestions(search) {
    if (typeof search !== 'string' || !this.filters.selectedField)
      return of([]);

    const queryArray = [];
    if (this.baseQuery.query) queryArray.push(`(${this.baseQuery.query})`);

    if (search)
      queryArray.push(`${this.filters.selectedField}:(\"${search}\")`);

    return this.restAPIService
      .getDataFromSearch({
        ...this.baseQuery,
        query: queryArray.join(' AND '),
        limit: Constants.maxOSDULimit,
      })
      .pipe(
        map((res) => {
          const objects = res.results as OsduObject[];
          const resultSet = new Set<string>();
          objects
            .map((el) =>
              Helper.getFieldFromDottedString(el, this.filters.selectedField)
            )
            .filter((field) => {
              return (
                field &&
                typeof field === 'string' &&
                field.toLowerCase().includes(search.toLowerCase())
              );
            })
            .forEach((el) => resultSet.add(el));

          return Array.from(resultSet).sort();
        }),
        catchError(() => [])
      );
  }

  getFieldSuggestions(search) {
    if (typeof search !== 'string') return of(this.fields);

    return of(
      this.fields.filter((el) =>
        el.toLowerCase().includes(search.toLowerCase())
      )
    );
  }
}
