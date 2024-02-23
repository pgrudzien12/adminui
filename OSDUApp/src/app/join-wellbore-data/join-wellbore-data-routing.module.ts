import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataJoinComponent } from './data-join/data-join.component';

const routes: Routes = [
  {
    path: '',
    component: DataJoinComponent,
    children: [],
    data: { title: 'Well & Wellbore data' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JoinWellboreDataRoutingModule {}
