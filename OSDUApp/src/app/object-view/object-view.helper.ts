import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root',
})
export class ObjectViewHelper {
  constructor(private cmnSrvc: CommonService) {}

  cleanAttributeID(attributes) {
    let indentation = '\xa0'.repeat(attributes.search(/\S/));
    return indentation + this.cmnSrvc.cleanAttributeID(attributes);
  }
}
