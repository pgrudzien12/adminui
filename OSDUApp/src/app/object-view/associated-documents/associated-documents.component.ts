import { Component, OnChanges, Input } from '@angular/core';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { OsduObject } from 'src/app/models/osdu-object.model';

@Component({
  selector: 'app-associated-documents',
  templateUrl: './associated-documents.component.html',
})
export class AssociatedDocumentsComponent implements OnChanges {
  @Input() objectId: string;

  listAssociated: OsduObject[] = [];

  private readonly documentsKind =
    'osdu:wks:work-product-component--Document:*';

  constructor(private restService: RestAPILayerService) {}

  ngOnChanges(): void {
    if (!this.objectId) return;

    this.getLinkedDocuments(this.objectId).subscribe((res) => {
      this.listAssociated = res.results;
    });
  }

  private getLinkedDocuments(id: string) {
    const query = {
      kind: this.documentsKind,
      query: `"${id}:"`,
    };

    return this.restService.getDataFromSearch(query);
  }
}
