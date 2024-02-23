import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntitlementComponent } from './entitlement/entitlement.component';
import { ManageGroupsComponent } from './manage-groups/manage-groups.component';
import { ManageUsersGroupComponent } from './manage-usersgroup/manage-usersgroup.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RoutesService } from '../common/routes.service';

const routes: Routes = [
  {
    path: '',
    component: EntitlementComponent,
    children: [
      {
        path: 'manage-groups',
        component: ManageGroupsComponent,
        data: { title: RoutesService.PAGE_TITLES.manageGroups },
      },
      {
        path: 'manage-usersgroup',
        component: ManageUsersGroupComponent,
        data: { title: RoutesService.PAGE_TITLES.manageUserGroups },
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
        data: { title: RoutesService.PAGE_TITLES.manageUsers },
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
        data: { title: RoutesService.PAGE_TITLES.manageUsers },
      },
      {
        path: 'user-profile/:id',
        component: UserProfileComponent,
        data: { title: RoutesService.PAGE_TITLES.manageUsers },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntitlementRoutingModule {}
