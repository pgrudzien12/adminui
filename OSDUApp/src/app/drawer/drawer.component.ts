import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { animateText, onSideNavChange } from '../animations/animations';
import { DrawerItem } from '../models/drawer.model';
import { SidenavService } from '../common/sidenav.service';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  animations: [onSideNavChange, animateText],
})
export class DrawerComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private sidenavService: SidenavService) {
    this.sidenavService.sideNavState$.subscribe((isOpened) => {
      this.sideNavState = isOpened;
      if (!this.sideNavState) this.accordion.closeAll();

      setTimeout(() => {
        this.linkText = this.sideNavState;
      }, 200);
    });
  }

  @Input() items: Array<DrawerItem> = [];

  @ViewChild(MatAccordion) accordion: MatAccordion;

  private _flatItems: DrawerItem[] = null;

  selected: DrawerItem = null;
  sideNavState: boolean = false;
  linkText: boolean = false;
  routerSubscription: Subscription;

  selectionChange(item: DrawerItem) {
    const { value, openInTab } = item;
    if (!openInTab) {
      this.router.navigateByUrl(value);
      return;
    }
    window.open(value, '_blank');
  }

  private getFlatItems() {
    if (this._flatItems !== null) return;

    const childrenItems = this.items
      .filter((item) => item.children.length > 0)
      .map((item) => item.children);

    this._flatItems = [...this.items];

    childrenItems.forEach(
      (childrenItem) =>
        (this._flatItems = [...this._flatItems, ...childrenItem])
    );
  }

  private refreshSelected() {
    this.getFlatItems();
    this.selected = this._flatItems.find((item) =>
      this.router.url.startsWith(item.value)
    );
  }

  isChildSelected(item: DrawerItem) {
    return (
      !!this.selected &&
      !!item.children.find((child) => child.value === this.selected?.value)
    );
  }

  afterExpand() {
    this.sidenavService.sideNavState$.next(true);
  }

  ngOnInit(): void {
    this.refreshSelected();
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(this.refreshSelected.bind(this));
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
