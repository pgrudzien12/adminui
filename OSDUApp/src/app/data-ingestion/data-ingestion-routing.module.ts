import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataIngestionComponent } from './data-ingestion/data-ingestion.component';
import { WorkFlowRunComponent } from './work-flow-run/work-flow-run.component';
import { WorkflowsComponent } from './workflows/workflows.component';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: DataIngestionComponent,
    children: [
      { path: 'workflowRun', component: WorkFlowRunComponent },
      { path: 'workflow', component: WorkflowsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataIngestionRoutingModule {}
