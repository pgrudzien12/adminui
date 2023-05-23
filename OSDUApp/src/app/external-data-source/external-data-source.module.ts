import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalDataSourceComponent } from './external-data-source/external-data-source.component';
import { ExternalDataSourceRoutingModule } from './external-data-source-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AddServiceAccComponent } from './add-service-acc/add-service-acc.component';
import { AddServiceAgreementComponent } from './add-service-agreement/add-service-agreement.component';
import { ExternalSourceRegPreviewComponent } from './external-source-reg-preview/external-source-reg-preview.component';
import { EdsDatajobComponent } from './eds-datajob/eds-datajob.component';
import { ExternaleMainComponent } from './externale-main/externale-main.component';
import { AddDatajobWorkflowComponent } from './add-datajob-workflow/add-datajob-workflow.component';
import { AddWorkflowParameterComponent } from './add-workflow-parameter/add-workflow-parameter.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    ExternalDataSourceComponent,
    AddServiceAccComponent,
    AddServiceAgreementComponent,
    ExternalSourceRegPreviewComponent,
    EdsDatajobComponent,
    ExternaleMainComponent,
    AddDatajobWorkflowComponent,
    AddWorkflowParameterComponent,
  ],
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule,
    ExternalDataSourceRoutingModule,
    NgSelectModule,
    NgxSpinnerModule,
    FormsModule,
    NgbModule,
    MatCardModule,
  ],
})
export class ExternalDataSourceModule {}
