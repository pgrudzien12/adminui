import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefDataMainComponent } from './ref-data-main/ref-data-main.component';

const routes: Routes = [
  {
    path: '',
    component: RefDataMainComponent,
    children: [],
    data: { title: 'Reference data' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RefDataRoutingModule {}
