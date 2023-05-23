import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataLoadingComponent } from './data-loading/data-loading.component';

const routes: Routes = [
  {
    path: '',
    component: DataLoadingComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataLoadingRoutingModule {}
