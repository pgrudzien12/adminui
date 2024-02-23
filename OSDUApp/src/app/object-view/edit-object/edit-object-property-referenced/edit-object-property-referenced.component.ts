import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Constants } from 'src/app/common/constants.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { SchemaProperty } from 'src/app/models/schema-property.model';

@Component({
  selector: 'app-edit-object-property-referenced',
  templateUrl: './edit-object-property-referenced.component.html',
})
export class EditObjectPropertyReferencedComponent
  implements OnChanges, OnInit
{
  @Input() value: string;
  @Input() valueName: string;
  @Input() property: SchemaProperty;
  @Input() readonly = false;

  @Output() valueChange = new EventEmitter<string>();

  options = [];

  myControl = new FormControl();

  kind = '';

  readonly limit = 5;
  readonly returnedFields = ['id'];

  constructor(private restService: RestAPILayerService) {}

  ngOnInit(): void {
    this.myControl.valueChanges
      .pipe(debounceTime(Constants.debounceTime))
      .subscribe(this.refreshOptions.bind(this));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.value) return;

    this.myControl.setValue(changes.value.currentValue, { emitEvent: false });

    const osduRelationShip = this.property['x-osdu-relationship'][0];

    if (!osduRelationShip) this.kind = '*';

    this.kind = `*:*:${osduRelationShip.GroupType}--${osduRelationShip.EntityType}:*`;
  }

  get tooltipLink() {
    const osduRelationShip = this.property['x-osdu-relationship'][0];

    return osduRelationShip
      ? `This field is linked to object of kind ${osduRelationShip.EntityType} on group ${osduRelationShip.GroupType}`
      : 'Unknown';
  }

  refreshOptions(value: string) {
    this.value = value;
    this.valueChange.emit(value);

    const escaped = this.value ? this.value.replace(':', '\\:') : '*';
    const query = escaped === '*' ? escaped : `"${escaped}" OR ${escaped}*`;

    this.restService
      .getDataFromSearch({
        kind: this.kind,
        limit: this.limit,
        returnedFields: this.returnedFields,
        query,
      })
      .subscribe((res) => {
        this.options = res.results.map((el) =>
          el.id.endsWith(':') ? el.id : `${el.id}:`
        );
      });
  }
}
