import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapMainComponent } from './map-main/map-main.component';

const routes: Routes = [
  {
    path: '',
    component: MapMainComponent,
    children: [],
    data: { title: 'Map' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapRoutingModule {}
