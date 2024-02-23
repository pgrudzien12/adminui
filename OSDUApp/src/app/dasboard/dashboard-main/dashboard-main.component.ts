import { Component } from '@angular/core';
import { Constants } from 'src/app/common/constants.service';
import { DrawerItem } from 'src/app/models/drawer.model';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.css'],
})
export class DashboardMainComponent {
  readonly tiles: DrawerItem[] = Constants.appMenuTree.filter(
    (el) => !el.openInTab
  );
}
