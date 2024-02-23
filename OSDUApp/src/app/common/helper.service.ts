import {
  OsduMember,
  OsduMemberWithAzureUser,
} from 'src/app/models/osdu-member.model';
import { AzureUser } from 'src/app/models/azure-user';
import { SweetAlertOptions } from 'sweetalert2';
import { OsduKind } from '../models/osdu-kind.model';
import { environment } from 'src/environments/environment';
import { DataPlatformFilterElement } from '../data-platform/models/data-platform-filter-element.model';
import { OsduObject } from '../models/osdu-object.model';

export class Helper {
  static isGroup(element: OsduMember) {
    return element.email.includes(`@${environment.settings.data_partition}`);
  }

  static displayAzureUser(user: AzureUser): string {
    if (!user) return '';
    const display: string[] = [];
    if (user.displayName) display.push(user.displayName);
    if (user.mail) display.push(user.mail);
    return display.join(' - ');
  }

  static displayOsduMemberWithAzureUser(member: OsduMemberWithAzureUser) {
    if (!member) return '';
    if (member.azureUser) return Helper.displayAzureUser(member.azureUser);
    return member.email;
  }

  static displayOsduMemberWithAzureUserName(member: OsduMemberWithAzureUser) {
    if (!member) return '';
    if (member.azureUser) return member.azureUser.displayName;
    return member.email;
  }

  private static durationInSeconds = 5;

  static readonly snackBarSuccessConfig = {
    duration: Helper.durationInSeconds * 1000,
    panelClass: ['mat-snackbar-success'],
  };

  static warningSweetAlertConfirmConfig(text: string): SweetAlertOptions {
    return {
      text,
      showCancelButton: true,
      title: 'Warning',
      icon: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'mat-raised-button mat-button-base mat-warn',
        cancelButton: 'mat-raised-button mat-button-base mat-primary',
      },
    };
  }

  static warningSweetAlertConfig(text: string): SweetAlertOptions {
    return {
      title: 'Warning',
      icon: 'warning',
      text,
      customClass: {
        confirmButton: 'mat-raised-button mat-button-base mat-primary',
      },
    };
  }

  static errorSweetAlertConfig(text: string): SweetAlertOptions {
    return {
      title: 'Error',
      icon: 'error',
      text,
      customClass: {
        confirmButton: 'mat-raised-button mat-button-base mat-primary',
      },
    };
  }

  static sucessSweetAlertConfig(text: string): SweetAlertOptions {
    return {
      title: 'Success!',
      icon: 'success',
      text,
      customClass: {
        confirmButton: 'mat-raised-button mat-button-base mat-primary',
      },
    };
  }

  static infoSweetAlertConfig(text: string): SweetAlertOptions {
    return {
      title: 'Confirmation',
      icon: 'info',
      text,
      customClass: {
        confirmButton: 'mat-raised-button mat-button-base mat-primary',
      },
    };
  }

  static confirmSweetAlertConfig(text: string): SweetAlertOptions {
    return {
      title: 'Confirm',
      icon: 'question',
      text,
      customClass: {
        confirmButton: 'mat-raised-button mat-button-base mat-primary',
        cancelButton: 'mat-raised-button mat-button-base mat-warn',
      },
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
    };
  }

  static displayOsduKind(kind: OsduKind) {
    return kind.schemaIdentity.id;
  }

  private static readonly IDRegWithVersion =
    /^[\w\-\.]+:[\w\-\.]+\-\-[\w\.]+:[\w\-\.\:\%]+[^:]:[0-9]+$/;

  static getObjectIdWithoutVersion(id: string) {
    if (!Helper.IDRegWithVersion.test(id)) return id;
    return id.split(':').slice(0, -1).join(':');
  }

  static getVersionFromId(id: string) {
    if (!Helper.IDRegWithVersion.test(id)) return null;
    return id.split(':').slice(-1);
  }

  static getSchemaRefNameFromDocumentRef(documentRef: string) {
    const prefix = '#/definitions/';
    return documentRef.substring(prefix.length);
  }

  static getQueryStringFromFiltersElements(
    filtersElements: DataPlatformFilterElement[],
    followingOperators: string[]
  ): string {
    const elements = filtersElements
      .filter((el) => !!el.value && !!el.selectedField)
      .map((el) => {
        return Helper.searchElement(el.selectedField, el.value);
      });

    if (elements.length === 0) {
      return '';
    }
    let queryString = elements[0];

    followingOperators.forEach((op, index) => {
      const followingElement = elements[index + 1];
      if (!followingElement) return;

      queryString = `${queryString} ${op} ${followingElement}`;
    });

    return queryString;
  }

  private static searchElement(field: string, value: string): string {
    if (field !== 'id') return `${field}:("${value}")`;
    return `${field}=("${value}")`;
  }

  static getFieldFromDottedString(object, fieldKey: string) {
    const path = fieldKey.split('.');

    let next = object;

    for (let i in path) {
      if (typeof next !== 'object') return null;
      next = next[path[i]];
    }

    return next;
  }

  static formatIdForStorageAPI(id: string) {
    return id.endsWith(':') ? id.substring(-1) : id;
  }

  static isShownOnMap(osduObject: OsduObject) {
    return (
      osduObject.data &&
      osduObject.data['SpatialLocation.Wgs84Coordinates'] &&
      osduObject.data['SpatialLocation.Wgs84Coordinates'].geometries &&
      osduObject.data['SpatialLocation.Wgs84Coordinates'].geometries?.length > 0
    );
  }
}
