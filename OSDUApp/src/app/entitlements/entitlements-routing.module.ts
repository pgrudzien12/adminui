import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntitlementComponent } from './entitlement/entitlement.component';
import { ManageGroupsComponent } from './manage-groups/manage-groups.component';
import { ManageUsersGroupComponent } from './manage-usersgroup/manage-usersgroup.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: EntitlementComponent,
    children: [
      {
        path: 'manage-groups',
        component: ManageGroupsComponent,
        data: { title: 'Manage groups' },
      },
      {
        path: 'manage-usersgroup',
        component: ManageUsersGroupComponent,
        data: { title: 'Manage group members' },
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
        data: { title: 'Manage members' },
      },
      {
        path: 'user-profile/:id',
        component: UserProfileComponent,
        data: { title: 'Manage user' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntitlementRoutingModule {}
