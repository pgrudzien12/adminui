import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavService } from '../common/sidenav.service';
import { HeaderService } from '../common/headers.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(
    public router: Router,
    public sidenavService: SidenavService,
    public headerService: HeaderService
  ) {}

  goHome() {
    this.router.navigateByUrl('/');
  }

  toggleSidenav() {
    this.sidenavService.toggleSideNav();
  }
}
