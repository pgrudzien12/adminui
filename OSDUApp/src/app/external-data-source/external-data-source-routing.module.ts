import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExternalDataSourceComponent } from './external-data-source/external-data-source.component';
import { EdsDatajobComponent } from './eds-datajob/eds-datajob.component';
import { ExternaleMainComponent } from './externale-main/externale-main.component';

const routes: Routes = [
  {
    path: '',
    component: ExternaleMainComponent,
    children: [
      {
        path: 'source',
        component: ExternalDataSourceComponent,
        data: { title: 'External Source Registration' },
      },
      { path: 'DataJob', component: EdsDatajobComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExternalDataSourceRoutingModule {}
