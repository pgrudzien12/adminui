import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObjectViewMainComponent } from './object-view-main/object-view-main.component';
import { ObjectAclComponent } from './object-acl/object-acl.component';
import { EditObjectComponent } from './edit-object/edit-object.component';
import { RoutesService } from '../common/routes.service';

const baseTitle = RoutesService.PAGE_TITLES.objectView;

const routes: Routes = [
  {
    path: ':id',
    component: ObjectViewMainComponent,
    children: [],
    data: { title: baseTitle },
  },
  {
    path: ':id/acl',
    component: ObjectAclComponent,
    data: { title: `${baseTitle} - Share object` },
  },
  {
    path: ':id/edit',
    component: EditObjectComponent,
    data: { title: `${baseTitle} - Edit object` },
  },
  {
    path: '',
    component: ObjectViewMainComponent,
    children: [],
    data: { title: baseTitle },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObjectViewRoutingModule {}
