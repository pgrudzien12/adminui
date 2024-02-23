import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/common/constants.service';

@Component({
  selector: 'app-select-table-columns',
  templateUrl: './select-table-columns.component.html',
})
export class SelectTableColumnsComponent implements OnInit, OnChanges {
  private readonly mandatoryColumns = Constants.objectMandatoryColumns;

  displayedColumns: string[] = [...this.mandatoryColumns];

  @Output() displayedColumnsChange = new EventEmitter<string[]>();

  separatorKeysCodes: number[] = [ENTER, COMMA];

  private readonly queryParamsId = 'selectedDisplayedColumns';

  @Input() allColumns: string[] = [];

  @Input() selectedField: string = '';
  @ViewChild('colInput') colInput: ElementRef<HTMLInputElement>;

  displayInput = true;

  filteredCols: Observable<string[]>;

  colCtrl = new FormControl();

  constructor(private router: Router, private route: ActivatedRoute) {
    this.filteredCols = this.colCtrl.valueChanges.pipe(
      startWith(null),
      map((col: string | null) => this.filter(col))
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.displayedColumns.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.colCtrl.setValue(null);

    this.displayedColumnsChange.emit(this.displayedColumns);
  }

  remove(col: string): void {
    const index = this.displayedColumns.indexOf(col);

    if (index >= 0) {
      this.displayedColumns.splice(index, 1);
      this.displayedColumnsChange.emit(this.displayedColumns);
      this.meregeParams();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.displayedColumns.push(event.option.viewValue);
    this.colInput.nativeElement.value = '';
    this.colCtrl.setValue(null);
    this.meregeParams();
  }

  private filter(filter: string) {
    return filter
      ? this.allColumns.filter(
          (col) =>
            !this.displayedColumns.includes(col) &&
            col.toLocaleLowerCase().includes(filter.toLowerCase())
        )
      : this.allColumns.filter((col) => !this.displayedColumns.includes(col));
  }

  private meregeParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [this.queryParamsId]: JSON.stringify(this.displayedColumns),
      },
      queryParamsHandling: 'merge',
    });
  }

  ngOnInit(): void {
    this.displayedColumnsChange.emit(this.displayedColumns);

    this.route.queryParams.subscribe((params) => {
      const param = params[this.queryParamsId];
      if (!param) {
        this.displayedColumns = [...this.mandatoryColumns];
        this.displayedColumnsChange.emit(this.displayedColumns);
        return;
      }

      this.displayedColumns = JSON.parse(param);
      this.displayedColumnsChange.emit(this.displayedColumns);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.allColumns) return;

    this.displayedColumns = this.displayedColumns.filter((el) =>
      this.allColumns.find((all) => all === el)
    );

    this.displayedColumnsChange.emit(this.displayedColumns);
  }
}
