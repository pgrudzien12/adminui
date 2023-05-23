import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LegalTags } from '../models/legal-tags.model';

@Component({
  selector: 'app-legal-tag-cell',
  templateUrl: './legal-tag-cell.component.html',
})
export class LegalTagCellComponent {
  @Input() legal: LegalTags;

  private static readonly legalTagUrl = '/legal-tags';

  constructor(private router: Router) {}

  navigate(tag: string) {
    this.router.navigate([LegalTagCellComponent.legalTagUrl], {
      queryParams: { tags: tag },
    });
  }
}
