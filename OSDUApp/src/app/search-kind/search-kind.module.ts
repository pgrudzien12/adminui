import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { SearchKindComponent } from './search-kind.component';
import { DataPlatformModule } from '../data-platform/data-platform.module';
import { KindAutocompleteComponent } from './kind-autocomplete/kind-autocomplete.component';
import { SearchKindRoutingModule } from './search-kind-routing.module';
import { CommonModule } from '../common/common.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [SearchKindComponent, KindAutocompleteComponent],
  imports: [
    NgCommonModule,
    SearchKindRoutingModule,
    DataPlatformModule,
    CommonModule,
    MatCardModule,
  ],
})
export class SearchKindModule {}
