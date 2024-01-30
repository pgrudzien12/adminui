import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, switchMap, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css'],
})
export class AutoCompleteComponent<T> implements OnInit, OnChanges {
  formControl: FormControl = new FormControl('');

  @Input() displayFn: (element: T) => string = (element: T) =>
    element.toString() ?? '';

  @Input() displaySubTextFn: (element: T) => string = (element: T) =>
    element?.toString() == '[object Object]' ? '' : element?.toString();

  @Output() enterKeyPressed = new EventEmitter<string>();

  @Input() getSuggestions: (filter: string) => Observable<T[]>;
  @Input() selected: T;
  @Input() label: string = '';
  @Input() icon: string = 'search';
  @Input() required = false;
  @Output() selectedChange = new EventEmitter<T>();

  filteredOptions: Observable<T[]>;

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
    if (!changes.selected) return;

    this.formControl.setValue(changes.selected.currentValue, {
      emitEvent: false,
    });
  }

  ngOnInit(): void {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      debounceTime(1000),
      startWith(''),
      switchMap((filter) => this.getSuggestions(filter))
    );
  }
}
