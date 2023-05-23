import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataPlatformComponent } from './data-platform/data-platform.component';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: DataPlatformComponent,
    children: [],
    data: { title: 'Search kind' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataPlatformRoutingModule {}
