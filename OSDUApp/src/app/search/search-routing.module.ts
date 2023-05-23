import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchQueryComponent } from './search-query/search-query.component';

const routes: Routes = [
  {
    path: '',
    component: SearchQueryComponent,
    children: [],
    data: { title: 'Search query' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
