import { Component, Input, OnChanges } from '@angular/core';
import { ObjectViewHelper } from '../object-view.helper';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';

@Component({
  selector: 'app-display-attributes',
  templateUrl: './display-attributes.component.html',
  styleUrls: ['./display-attributes.component.css'],
})
export class DisplayAttributesComponent implements OnChanges {
  private readonly objectViewUrl = '/object-view';

  @Input() object = null;

  constructor(private objectViewHelper: ObjectViewHelper) {}

  ngOnChanges(): void {
    if (this.object) {
      this.dataSource.data = this.buildTree(this.object);
    }
  }

  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      value: node.value,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<any>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: any) => node.expandable;

  cleanAttributeID(attributes) {
    return this.objectViewHelper.cleanAttributeID(attributes);
  }

  isObject(obj) {
    return obj && typeof obj === 'object' && !Array.isArray(obj);
  }

  isArray(obj) {
    return Array.isArray(obj);
  }

  isNull(obj) {
    return obj === null || obj === undefined;
  }

  navigateTo(url) {
    return [this.objectViewUrl, url];
  }

  buildNestedElement(key, child) {
    if (this.isObject(child) || this.isArray(child))
      return {
        name: key,
        children: this.buildTree(child),
      };

    return {
      name: key,
      value: child,
    };
  }

  buildTree(element) {
    if (this.isObject(element)) {
      const children = Object.keys(element)
        .sort()
        .map((key) => {
          const child = element[key];

          return this.buildNestedElement(key, child);
        });
      return children;
    }

    if (this.isArray(element)) {
      return element.map((child, index) => {
        return this.buildNestedElement(index, child);
      });
    }

    if (this.isNull(element)) {
      return {
        name: null,
      };
    }

    return {
      name: element,
    };
  }

  isRegexIDWithIndent(objId) {
    const IDReg = /^[/\s/g]*[\w\-\.]+:[\w\-\.]+\-\-[\w\.]+:[\w\-\.\:\%]+$/;
    return IDReg.test(objId);
  }

  expandAll() {
    this.treeControl.expandAll();
  }

  collapseAll() {
    this.treeControl.collapseAll();
  }
}
