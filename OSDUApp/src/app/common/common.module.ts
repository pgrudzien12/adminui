import { NgModule } from '@angular/core';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { GroupeTypeRadioButtonComponent } from '../groupe-type-radio-button/groupe-type-radio-button.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LegalTagCellComponent } from '../legal-tag-cell/legal-tag-cell.component';
import { ObjectidCellComponent } from 'src/app/objectid-cell/objectid-cell.component';
import { ObjectCellComponent } from '../object-cell/object-cell.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { GroupAutocompleteComponent } from '../group-autocomplete/group-autocomplete.component';
import { AzureUserPipe } from '../pipes/user.pipe';

@NgModule({
  declarations: [
    EmptyStateComponent,
    GroupeTypeRadioButtonComponent,
    LegalTagCellComponent,
    ObjectidCellComponent,
    ObjectCellComponent,
    AutoCompleteComponent,
    GroupAutocompleteComponent,
    AzureUserPipe,
  ],
  imports: [
    AngularCommonModule,
    MatRadioModule,
    FormsModule,
    MatIconModule,
    NgxJsonViewerModule,
    MatDialogModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: [
    EmptyStateComponent,
    GroupeTypeRadioButtonComponent,
    LegalTagCellComponent,
    ObjectidCellComponent,
    ObjectCellComponent,
    AutoCompleteComponent,
    GroupAutocompleteComponent,
    AzureUserPipe,
  ],
})
export class CommonModule {}
