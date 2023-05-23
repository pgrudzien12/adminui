import { Component, Input } from '@angular/core';
import { animateText } from '../animations/animations';
import { DrawerItem } from '../models/drawer.model';

@Component({
  selector: 'app-drawer-item',
  templateUrl: './drawer-item.component.html',
  styleUrls: ['./drawer-item.component.scss'],
  animations: [animateText],
})
export class DrawerItemComponent {
  @Input() item: DrawerItem;
  @Input() linkText: boolean;
}
