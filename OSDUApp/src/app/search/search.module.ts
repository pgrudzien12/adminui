import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRoutingModule } from './search-routing.module';
import { SearchQueryComponent } from './search-query/search-query.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { AddACLComponent } from './add-acl/add-acl.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SearchQueryComponent, AddACLComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    NgSelectModule,
    FormsModule,
    NgxSpinnerModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatIconModule,
  ],
})
export class SearchModule {}
