import { Component } from '@angular/core';
import { DrawerItem } from '../models/drawer.model';
import { Constants } from '../common/constants.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent {
  drawerOpened: boolean = false;
  readonly items: DrawerItem[] = Constants.appMenuTree;
}
