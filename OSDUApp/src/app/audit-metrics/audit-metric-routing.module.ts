import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdutiAndMetricComponent } from './aduti-and-metric/aduti-and-metric.component';

const routes: Routes = [
  {
    path: '',
    component: AdutiAndMetricComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditMetricRoutingModule {}
