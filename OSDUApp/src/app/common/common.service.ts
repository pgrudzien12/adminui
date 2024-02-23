import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OsduAssociatedObject } from '../models/osdu-associated-object.model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  sideNavLists = [];
  SideNavHeader = '';
  EandOgroupEmailList = [];
  UsersList = [];
  workFlowNameList = [];
  storageKindList;
  objectID;
  searchQuery;
  referenceQuery;
  listAssociatedObjs = [];
  selectedObjects = [];
  tabObjectFilesAssociated = undefined;
  progressionBarDownloadValue = 0;
  progressionBarDownloadText = '';
  booleanModuleManageMember = false;
  selectedStorageKindId: string;

  isUserGuide: boolean;
  userGuideLink = '';
  bkgndColor = '';
  bkgndColorDash = '';
  externalDataSources;
  queryData;

  filterByValue(array, string) {
    return array.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(string.toLowerCase())
      )
    );
  }

  cleanAttributeID(attributes) {
    let attr = attributes.split('--').at(-1);
    attr = attr.substring(attr.indexOf(':') + 1);
    if (attr.endsWith(':')) {
      attr = attr.slice(0, -1);
      if (attr.endsWith(':')) {
        attr = attr.slice(0, -1);
      }
    }
    return decodeURIComponent(attr);
  }

  cleanAttributeKIND(attributes) {
    return attributes.split('--').at(-1).split(':').at(0);
  }

  findAttibuteNameObject(objectData, kind: string) {
    let attributename = kind.concat('Name');

    if (objectData === undefined) {
      return '';
    } else if ('Name' in objectData) {
      return objectData.Name;
    } else if ('FacilityName' in objectData) {
      return objectData.FacilityName;
    } else if (attributename in objectData) {
      return objectData[attributename];
    } else {
      return '';
    }
  }

  addObjectNameAtAttributeTreeRoot(
    dataSource: MatTableDataSource<OsduAssociatedObject>
  ) {
    const dataSourceData = dataSource.data;
    dataSourceData?.forEach((element) => {
      element.name = this.findAttibuteNameObject(
        element.data,
        this.cleanAttributeKIND(element.kind)
      );
    });
  }

  // calculate Attribute File Size
  // Use to give information about the size of the File in associated tab
  // Also usefull in the Download functionality
  calculateAttributeFileSize(fileSize) {
    if (fileSize !== undefined) {
      return this.formatBytes(fileSize);
    } else {
      return '';
    }
  }

  // Improve visualisation of File size
  // From int in bytes to adapted format
  formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  getDateFromVersion(dateUnix) {
    let date = new Date(dateUnix);
    return date.toLocaleString();
  }

  sortTable(n, tblId) {
    const table = document.getElementById(tblId) as any;
    let count = 0;
    let switching = true;
    let istart = 0;
    if (tblId == 'tbllegalDetails') {
      istart = 2;
    }
    // Order is set as ascending
    let direction = 'ascending';

    // Run loop until no switching is needed
    while (switching) {
      switching = false;
      const rows = table.rows;
      let Switch, i;
      //Loop to go through all rows
      for (i = istart; i < rows.length - 1; i++) {
        Switch = false;

        // Fetch 2 elements that need to be compared
        const x = rows[i].getElementsByTagName('TD')[n];
        const y = rows[i + 1].getElementsByTagName('TD')[n];

        // Check the direction of order
        if (direction == 'ascending') {
          // Check if 2 rows need to be switched
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If yes, mark Switch as needed and break loop
            Switch = true;
            break;
          }
        } else if (direction == 'descending') {
          // Check direction
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If yes, mark Switch as needed and break loop
            Switch = true;
            break;
          }
        }
      }
      if (Switch) {
        // Function to switch rows and mark switch as completed
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;

        // Increase count for each switch
        count++;
      } else {
        // Run while loop again for descending order
        if (count == 0 && direction == 'ascending') {
          direction = 'descending';
          switching = true;
        }
      }
    }
  }

  // On/Off the module Manage Member
  // depending of yours rights
  onModuleManageMember() {
    for (let group in this.EandOgroupEmailList) {
      if (this.EandOgroupEmailList[group].startsWith('users.data.root@')) {
        this.booleanModuleManageMember = true;
        return;
      }
    }
  }
}
