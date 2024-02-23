import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchQueryComponent } from './search-query/search-query.component';
import { RoutesService } from '../common/routes.service';

const routes: Routes = [
  {
    path: '',
    component: SearchQueryComponent,
    children: [],
    data: { title: RoutesService.PAGE_TITLES.searchQuery },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
