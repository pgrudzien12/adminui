import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  startWith,
  switchMap,
  debounceTime,
  tap,
  takeUntil,
  skip,
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Constants } from '../common/constants.service';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css'],
})
export class AutoCompleteComponent<T> implements OnInit, OnChanges, OnDestroy {
  formControl: FormControl = new FormControl('');

  @Input() displayFn: (element: T) => string = (element: T) =>
    element?.toString() ?? '';

  @Input() displaySubTextFn: (element: T) => string = (element: T) =>
    element?.toString() == '[object Object]' ? '' : element?.toString();

  @Output() enterKeyPressed = new EventEmitter<string>();

  @Input() getSuggestions: (filter: string) => Observable<T[]>;
  @Input() selected: T;
  @Input() label: string = '';
  @Input() icon: string = 'search';
  @Input() required = false;
  @Input() disabled = false;
  @Output() selectedChange = new EventEmitter<T>();
  @Output() inputChange = new EventEmitter<string>();

  filteredOptions: Observable<T[]>;

  private _destroyed = new Subject<unknown>();

  optionSelected(event: MatAutocompleteSelectedEvent) {
    this.selected = event.option.value;
    this.selectedChange.emit(this.selected);
  }

  onEnterKey(): void {
    this.enterKeyPressed.emit(this.formControl.value);
  }

  clear() {
    this.selected = null;
    this.formControl.setValue('');
    this.selectedChange.emit(this.selected);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selected)
      this.formControl.setValue(changes.selected.currentValue, {
        emitEvent: false,
      });

    if (changes.disabled) {
      changes.disabled.currentValue
        ? this.formControl.disable()
        : this.formControl.enable();
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  ngOnInit(): void {
    const baseObservable = this.formControl.valueChanges.pipe(
      takeUntil(this._destroyed),
      debounceTime(Constants.debounceTime),
      startWith('')
    );

    this.filteredOptions = baseObservable.pipe(
      switchMap((filter) => this.getSuggestions(filter))
    );

    baseObservable
      .pipe(
        skip(1),
        tap((filter) => this.inputChange.emit(filter))
      )
      .subscribe();
  }
}
