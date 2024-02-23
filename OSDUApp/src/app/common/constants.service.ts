import { Injectable } from '@angular/core';
import { RoutesService } from './routes.service';
import { DrawerItem } from '../models/drawer.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Constants {
  static appMenuTree: DrawerItem[] = [
    {
      icon: 'manage_accounts',
      label: RoutesService.PAGE_TITLES.userManagementSection,
      value: '/user-management',
      openInTab: false,
      children: [
        {
          icon: 'group',
          label: RoutesService.PAGE_TITLES.manageGroups,
          value: '/entitlement/manage-groups',
          openInTab: false,
          children: [],
        },
        {
          icon: 'badge',
          label: RoutesService.PAGE_TITLES.manageUserGroups,
          value: '/entitlement/manage-usersgroup',
          openInTab: false,
          children: [],
        },
        {
          icon: 'person',
          label: RoutesService.PAGE_TITLES.manageUsers,
          value: '/entitlement/manage-users',
          openInTab: false,
          children: [],
        },
        {
          icon: 'account_box',
          label: 'User profile',
          value: '/entitlement/user-profile',
          openInTab: false,
          children: [],
        },
        {
          icon: 'sell',
          label: RoutesService.PAGE_TITLES.legalTags,
          value: '/legal-tags',
          openInTab: false,
          children: [],
        },
      ],
    },

    {
      icon: 'source',
      label: RoutesService.PAGE_TITLES.dataManagementSection,
      value: '/datamanagement',
      openInTab: false,
      children: [
        {
          icon: 'manage_search',
          label: RoutesService.PAGE_TITLES.searchKind,
          value: '/search-kind',
          openInTab: false,
          children: [],
        },
        {
          icon: 'screen_search_desktop',
          label: RoutesService.PAGE_TITLES.searchQuery,
          value: '/search-query',
          openInTab: false,
          children: [],
        },
        {
          icon: 'data_object',
          label: RoutesService.PAGE_TITLES.objectView,
          value: '/object-view',
          openInTab: false,
          children: [],
        },

        {
          icon: 'key',
          label: RoutesService.PAGE_TITLES.manageDataGroup,
          value: '/acl/manage-data-groups',
          openInTab: false,
          children: [],
        },
        {
          icon: 'format_list_bulleted',
          label: RoutesService.PAGE_TITLES.refData,
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
          icon: 'merge',
          label: 'Well & wellbore data',
          value: '/join-data',
          openInTab: false,
          children: [],
        },
      ],
    },
  ];
  static readonly userGroup =
    'users@' + environment.settings.data_partition + '.dataservices.energy';

  static readonly objectMandatoryColumns = ['id', 'legal'];

  static readonly debounceTime = 1000;

  static readonly maxOSDULimit = 1000;

  static readonly requestDefaultLimit = 100;

  static readonly filtersElementStorageKey = 'filtersElements';

  static readonly followingOperatorsStorageKey = 'followingOperators';
}

