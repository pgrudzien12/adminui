import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapMainComponent } from './map-main/map-main.component';
import { RoutesService } from '../common/routes.service';

const routes: Routes = [
  {
    path: '',
    component: MapMainComponent,
    children: [],
    data: { title: RoutesService.PAGE_TITLES.map },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapRoutingModule {}
