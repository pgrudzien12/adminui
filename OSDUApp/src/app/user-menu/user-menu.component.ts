import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { GraphApiService } from '../common/graph-api.service';
import jsonPackage from 'package.json';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css'],
})
export class UserMenuComponent implements OnInit, OnDestroy {
  loggedIn = false;
  userPhoto = null;
  private readonly _destroying$ = new Subject<void>();

  username = '';
  email = '';

  readonly applicationVersion = jsonPackage.version;
  readonly env = environment.name;

  constructor(
    private authService: MsalService,
    private broadcastService: MsalBroadcastService,
    private graphAPI: GraphApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.broadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )

      .subscribe(() => {
        this.setLoginDisplay();
      });
  }

  setLoginDisplay() {
    this.loggedIn = this.authService.instance.getAllAccounts().length > 0;
    if (!this.loggedIn) return;
    const account = this.authService.instance.getAllAccounts()[0];
    this.username = account.name ?? '';
    this.email = account.username;

    this.getUserPhoto();
  }

  private getUserPhoto() {
    this.graphAPI.getCurrentUserPhoto().subscribe((blob: any) => {
      const objectURL = URL.createObjectURL(blob);
      this.userPhoto = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    });
  }

  ngOnDestroy(): void {
    this._destroying$.next(null);
    this._destroying$.complete();
  }

  logout() {
    this.authService.logoutRedirect();
  }
}
