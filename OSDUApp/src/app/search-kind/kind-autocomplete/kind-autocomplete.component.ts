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
    });
  }

  refreshedList$(filter: string): Observable<OsduKind[]> {
    if (!filter || typeof filter !== 'string')
      return of(
        this.populateKindListWithNoVersion(this.kindList).sort(
          this.sortOsduKindList
        )
      );

    const filteredArray = this.kindList.filter((k) =>
      k.schemaIdentity.id.toLowerCase().includes(filter.toLowerCase())
    );

    return of(
      this.populateKindListWithNoVersion(filteredArray).sort(
        this.sortOsduKindList
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

  populateKindListWithNoVersion(osduKindList: OsduKind[]): OsduKind[] {
    const kindSet = new Set();

    osduKindList.forEach((kind) => {
      const kindSplitArray = kind.schemaIdentity.id.split(':');
      kindSplitArray.pop();
      const idWithoutVersion = `${kindSplitArray.join(':')}:*`;
      kindSet.add(idWithoutVersion);
    });

    const kindArrayNoVersion: OsduKind[] = Array.from(kindSet).map(
      (id: string) => {
        return {
          createdBy: 'adminUi',
          dateCreated: '',
          schemaIdentity: {
            id,
            authority: '',
            entityType: '',
            schemaVersionMajor: 0,
            schemaVersionMinor: 0,
            schemaVersionPatch: 0,
            source: '',
          },
          scope: '',
          status: '',
        };
      }
    );

    return [...osduKindList, ...kindArrayNoVersion];
  }

  sortOsduKindList(a: OsduKind, b: OsduKind) {
    return a.schemaIdentity.id.localeCompare(b.schemaIdentity.id);
  }
}
