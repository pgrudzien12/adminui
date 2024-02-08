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
import { OsduObjectListComponent } from '../osdu-object-list/osdu-object-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { SelectTableColumnsComponent } from '../data-platform/select-table-columns/select-table-columns.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserIconComponent } from '../user-icon/user-icon.component';

@NgModule({
  declarations: [
    EmptyStateComponent,
    GroupeTypeRadioButtonComponent,
    LegalTagCellComponent,
    ObjectidCellComponent,
    ObjectCellComponent,
    AutoCompleteComponent,
    GroupAutocompleteComponent,
    SelectTableColumnsComponent,
    OsduObjectListComponent,
    AzureUserPipe,
    UserIconComponent,
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
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatChipsModule,
    ReactiveFormsModule,
  ],
  exports: [
    EmptyStateComponent,
    GroupeTypeRadioButtonComponent,
    LegalTagCellComponent,
    ObjectidCellComponent,
    ObjectCellComponent,
    OsduObjectListComponent,
    AutoCompleteComponent,
    GroupAutocompleteComponent,
    AzureUserPipe,
    UserIconComponent,
  ],
})
export class CommonModule {}
