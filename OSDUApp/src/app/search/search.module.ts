import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRoutingModule } from './search-routing.module';
import { SearchQueryComponent } from './search-query/search-query.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { AddACLComponent } from './add-acl/add-acl.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [SearchQueryComponent, AddACLComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    NgSelectModule,
    FormsModule,
    NgxSpinnerModule,
    MatCardModule,
  ],
})
export class SearchModule {}
