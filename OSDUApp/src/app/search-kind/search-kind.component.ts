import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OsduKind } from '../models/osdu-kind.model';

@Component({
  selector: 'app-search-kind',
  templateUrl: './search-kind.component.html',
})
export class SearchKindComponent implements OnInit {
  selectedStorageKind: OsduKind = null;

  baseQuery = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (
        !params.selectedStorageKind ||
        !JSON.parse(params.selectedStorageKind)
      ) {
        this.selectedStorageKind = null;
        this.baseQuery = null;
        return;
      }
      this.selectedStorageKind = JSON.parse(params.selectedStorageKind);
      if (
        this.selectedStorageKind?.schemaIdentity.id !== this.baseQuery?.kind
      ) {
        this.baseQuery = null;
        this.changeDetectorRef.detectChanges();
      }
      this.baseQuery = {
        kind: this.selectedStorageKind.schemaIdentity.id,
      };
    });
  }

  selectedKindChange() {
    this.launchSearch();
  }

  launchSearch() {
    this.router.navigate(['/search-kind'], {
      queryParams: {
        selectedStorageKind: JSON.stringify(this.selectedStorageKind),
      },
    });
  }
}
