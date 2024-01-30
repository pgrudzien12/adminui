import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AzureUser } from 'src/app/models/azure-user';
import { switchMap, filter } from 'rxjs/operators';
import { GraphApiService } from 'src/app/common/graph-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user: AzureUser;

  constructor(
    private route: ActivatedRoute,
    private graphApi: GraphApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        filter((params) => !!params.id),
        switchMap((params) => {
          return this.graphApi.getUsersAndAppsById(params.id);
        })
      )
      .subscribe((user) => {
        this.user = user;
      });
  }

  selectUser(user: AzureUser) {
    this.user = user;
    let routerLink = '/entitlement/user-profile/' + user.id;
    this.router.navigateByUrl(routerLink);
  }
}
