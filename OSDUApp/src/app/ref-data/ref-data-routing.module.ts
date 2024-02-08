import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefDataMainComponent } from './ref-data-main/ref-data-main.component';
import { RoutesService } from '../common/routes.service';

const routes: Routes = [
  {
    path: '',
    component: RefDataMainComponent,
    children: [],
    data: { title: RoutesService.PAGE_TITLES.refData },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RefDataRoutingModule {}
