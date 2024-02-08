import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageDataGroupComponent } from './manage-data-group/manage-data-group.component';
import { RoutesService } from '../common/routes.service';

const routes: Routes = [
  {
    path: 'manage-data-groups',
    component: ManageDataGroupComponent,
    data: { title: RoutesService.PAGE_TITLES.manageDataGroup },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AclRoutingModule {}
