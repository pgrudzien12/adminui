import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-objectid-cell',
  templateUrl: './objectid-cell.component.html',
})
export class ObjectidCellComponent {
  @Input() id: string = '';

  private static readonly objectViewUrl = '/object-view';

  constructor(private router: Router) {}

  navigate() {
    this.router.navigate([ObjectidCellComponent.objectViewUrl, this.id]);
  }
}
