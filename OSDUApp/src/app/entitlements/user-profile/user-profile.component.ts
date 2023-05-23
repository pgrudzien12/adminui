import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AzureUser } from 'src/app/models/azure-user';
import { switchMap, filter } from 'rxjs/operators';
import { GraphApiService } from 'src/app/common/graph-api.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user: AzureUser;

  constructor(
    private route: ActivatedRoute,
    private graphApi: GraphApiService
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
}
