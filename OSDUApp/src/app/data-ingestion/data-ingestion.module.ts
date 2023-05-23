import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataIngestionComponent } from './data-ingestion/data-ingestion.component';
import { DataIngestionRoutingModule } from './data-ingestion-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { WorkFlowRunComponent } from './work-flow-run/work-flow-run.component';
import { WorkflowsComponent } from './workflows/workflows.component';
import { WfRunViewComponent } from './wf-run-view/wf-run-view.component';
import { CreateWorkflowComponent } from './create-workflow/create-workflow.component';
import { WorkflowRunDetailsComponent } from './workflow-run-details/workflow-run-details.component';

@NgModule({
  declarations: [
    DataIngestionComponent,
    WorkFlowRunComponent,
    WorkflowsComponent,
    WfRunViewComponent,
    CreateWorkflowComponent,
    WorkflowRunDetailsComponent,
  ],
  imports: [
    CommonModule,
    DataIngestionRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
  ],
})
export class DataIngestionModule {}
