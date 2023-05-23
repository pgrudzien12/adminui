import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { OsduKind } from '../../models/osdu-kind.model';
import { Observable, of } from 'rxjs';
import { Helper } from '../../common/helper.service';

@Component({
  selector: 'app-kind-autocomplete',
  templateUrl: './kind-autocomplete.component.html',
})
export class KindAutocompleteComponent {
  kindList: OsduKind[] = [];
  @Output() selectedChange = new EventEmitter<OsduKind>();
  @Input() selected: OsduKind;
  @Input() label: string = 'Search for kind';

  constructor(private restService: RestAPILayerService) {
    this.restService.getSchemaKindList().subscribe((result) => {
      if (typeof result === 'string') return;

      this.kindList = result['schemaInfos'];
      this.kindList = this.kindList.filter((x) =>
        x.schemaIdentity.id.startsWith('osdu:')
      );
    });
  }

  refreshedList$(filter: string): Observable<OsduKind[]> {
    if (!filter || typeof filter !== 'string') return of(this.kindList);
    return of(
      this.kindList.filter((k) =>
        k.schemaIdentity.id.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }

  optionSelected(event: OsduKind) {
    this.selected = event;
    this.selectedChange.emit(this.selected);
  }

  clearGroup() {
    this.selected = null;
    this.selectedChange.emit(this.selected);
  }

  displayFn(element: OsduKind) {
    return element ? Helper.displayOsduKind(element) : '';
  }
}
