import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataPlatformComponent } from './data-platform/data-platform.component';
import { DataPlatformRoutingModule } from './data-platform-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataplatformSearchFiltersComponent } from './dataplatform-search-filters/dataplatform-search-filters.component';
import { SpatialFiltersComponent } from './spatial-filters/spatial-filters.component';
import { OsduObjectListComponent } from '../osdu-object-list/osdu-object-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule as OSDUCommonModule } from 'src/app/common/common.module';
import { DataPlatformFilterElementComponent } from './data-platform-filter-element/data-platform-filter-element.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { KindAutocompleteComponent } from './kind-autocomplete/kind-autocomplete.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectTableColumnsComponent } from './select-table-columns/select-table-columns.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    DataPlatformComponent,
    DataplatformSearchFiltersComponent,
    SpatialFiltersComponent,
    OsduObjectListComponent,
    DataPlatformFilterElementComponent,
    KindAutocompleteComponent,
    SelectTableColumnsComponent,
  ],
  imports: [
    CommonModule,
    DataPlatformRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    OSDUCommonModule,
  ],
})
export class DataPlatformModule {}
