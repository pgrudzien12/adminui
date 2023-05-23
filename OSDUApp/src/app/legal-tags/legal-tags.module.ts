import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalTagsComponent } from './legal-tags/legal-tags.component';
import { LegalTagsRoutingModule } from './legal-tags-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { EditLegalTagsComponent } from './edit-legal-tags/edit-legal-tags.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AddLegalTagComponent } from './add-legal-tag/add-legal-tag.component';
import { StorageComponent } from './storage/storage.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  declarations: [
    LegalTagsComponent,
    EditLegalTagsComponent,
    AddLegalTagComponent,
    StorageComponent,
  ],
  imports: [
    CommonModule,
    LegalTagsRoutingModule,
    NgbModule,
    FormsModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule,
    MatCardModule,
  ],
})
export class LegalTagsModule {}
