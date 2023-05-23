import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntitlementComponent } from './entitlement/entitlement.component';
import { EntitlementRoutingModule } from './entitlements-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageUsersGroupComponent } from './manage-usersgroup/manage-usersgroup.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageGroupsComponent } from './manage-groups/manage-groups.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EditUserComponent } from './edit-user/edit-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CreatGroupComponent } from './creat-group/creat-group.component';
import { AddMemberComponent } from './add-member/add-member.component';
import { CreateMemberComponent } from './create-member/create-member.component';
import { UserAutocompleteComponent } from './user-autocomplete/user-autocomplete.component';
import { MatInputModule } from '@angular/material/input';
import { UserListComponent } from './user-list/user-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule as AppCommonModule } from '../common/common.module';
import { MemberAutocompleteComponent } from './member-autocomplete/member-autocomplete.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MatCardModule } from '@angular/material/card';
import { UserMembershipsComponent } from './user-memberships/user-memberships.component';
import { EditUserRoleComponent } from './edit-user-role/edit-user-role.component';
import { GroupListComponent } from './group-list/group-list.component';

@NgModule({
  declarations: [
    EntitlementComponent,
    ManageUsersGroupComponent,
    ManageUsersComponent,
    ManageGroupsComponent,
    EditUserComponent,
    CreatGroupComponent,
    AddMemberComponent,
    CreateMemberComponent,
    UserAutocompleteComponent,
    UserListComponent,
    MemberAutocompleteComponent,
    UserProfileComponent,
    UserMembershipsComponent,
    EditUserRoleComponent,
    GroupListComponent,
  ],
  imports: [
    CommonModule,
    EntitlementRoutingModule,
    NgbModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatCardModule,
    AppCommonModule,
  ],
})
export class EntitlementsModule {}
