import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  public sideNavState$: Subject<boolean> = new Subject();

  private _isOpened = false;

  public toggleSideNav() {
    this._isOpened = !this._isOpened;

    this.sideNavState$.next(this._isOpened);
  }

  get isOpened() {
    return this._isOpened;
  }
}
