import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  static readonly PAGE_TITLES = {
    userManagementSection: 'User Management',
    manageGroups: 'Manage Groups',
    manageUserGroups: 'Manage Group Members',
    manageUsers: 'Manage Members',
    legalTags: 'Manage Legal Tags',
    dataManagementSection: 'Data Management',
    searchQuery: 'Search Query',
    refData: 'Search Reference Data',
    searchKind: 'Search Kind',
    objectView: 'Process Objects',
    userGuide: 'User Guide',
    manageDataGroup: 'Manage Data Groups',
    map: 'Map',
    externalDataSource: 'External Data Source Registration',
  };
}
