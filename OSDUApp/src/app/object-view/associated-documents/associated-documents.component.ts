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

  private static readonly LINKED_DOCUMENTS_LIMIT = 1000;
  private static readonly DOCUMENTS_KIND =
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
      kind: AssociatedDocumentsComponent.DOCUMENTS_KIND,
      query: `"${id}:"`,
      limit: AssociatedDocumentsComponent.LINKED_DOCUMENTS_LIMIT,
    };

    return this.restService.getDataFromSearch(query);
  }
}
