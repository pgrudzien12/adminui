import { NgModule } from '@angular/core';
import { CommonModule as OSDUCommonModule } from 'src/app/common/common.module';
import { JoinWellboreDataRoutingModule } from './join-wellbore-data-routing.module';
import { DataJoinComponent } from './data-join/data-join.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [DataJoinComponent],
  imports: [
    CommonModule,
    JoinWellboreDataRoutingModule,
    MatCardModule,
    NgxSpinnerModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    OSDUCommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatAutocompleteModule,
  ],
})
export class JoinWellboreDataModule {}
