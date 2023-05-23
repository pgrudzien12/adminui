import { Component } from '@angular/core';
import { DrawerItem } from '../models/drawer.model';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent {
  drawerOpened: boolean = false;

  readonly items: DrawerItem[] = [
    {
      icon: 'group',
      label: 'Manage groups',
      value: '/entitlement/manage-groups',
      openInTab: false,
      children: [],
    },
    {
      icon: 'badge',
      label: 'Manage group members',
      value: '/entitlement/manage-usersgroup',
      openInTab: false,
      children: [],
    },
    {
      icon: 'person',
      label: 'Manage members',
      value: '/entitlement/manage-users',
      openInTab: false,
      children: [],
    },
    {
      icon: 'sell',
      label: 'Manage legal tags',
      value: '/legal-tags',
      openInTab: false,
      children: [],
    },
    {
      icon: 'manage_search',
      label: 'Search kind',
      value: '/data-platform',
      openInTab: false,
      children: [],
    },
    {
      icon: 'screen_search_desktop',
      label: 'Search query',
      value: '/search-query',
      openInTab: false,
      children: [],
    },
    {
      icon: 'data_object',
      label: 'Object view',
      value: '/object-view',
      openInTab: false,
      children: [],
    },
    {
      icon: 'format_list_bulleted',
      label: 'Reference data',
      value: '/ref-data',
      openInTab: false,
      children: [],
    },
    {
      icon: 'map',
      label: 'Map',
      value: '/map',
      openInTab: false,
      children: [],
    },
    {
      icon: 'control_camera',
      label: 'Source registration',
      value: '/EDS/source',
      openInTab: false,
      children: [],
    },
    {
      icon: 'help',
      label: 'User documentation',
      value:
        'https://totalworkplace.sharepoint.com/sites/TTEUganda-TilengaDataPlatform-03AdminUI/Documents%20partages/Forms/AllItems.aspx?id=%2Fsites%2FTTEUganda%2DTilengaDataPlatform%2D03AdminUI%2FDocuments%20partages%2F03%20AdminUI%2Fdocumentation%2Fuser%20documentation%2FAdmin%5FUI%5FUser%5FGuide%2Epdf&parent=%2Fsites%2FTTEUganda%2DTilengaDataPlatform%2D03AdminUI%2FDocuments%20partages%2F03%20AdminUI%2Fdocumentation%2Fuser%20documentation',
      openInTab: true,
      children: [],
    },
  ];
}
