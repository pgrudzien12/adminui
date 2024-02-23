import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchKindComponent } from './search-kind.component';
import { RoutesService } from '../common/routes.service';

const routes: Routes = [
  {
    path: '',
    component: SearchKindComponent,
    data: { title: RoutesService.PAGE_TITLES.searchKind },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchKindRoutingModule {}
