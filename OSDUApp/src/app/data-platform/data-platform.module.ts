import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataPlatformComponent } from './data-platform/data-platform.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataplatformSearchFiltersComponent } from './dataplatform-search-filters/dataplatform-search-filters.component';
import { SpatialFiltersComponent } from './spatial-filters/spatial-filters.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule as OSDUCommonModule } from 'src/app/common/common.module';
import { DataPlatformFilterElementComponent } from './data-platform-filter-element/data-platform-filter-element.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    DataPlatformComponent,
    DataplatformSearchFiltersComponent,
    SpatialFiltersComponent,
    DataPlatformFilterElementComponent,
  ],
  imports: [
    CommonModule,
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
  exports: [DataplatformSearchFiltersComponent, DataPlatformComponent],
})
export class DataPlatformModule {}
