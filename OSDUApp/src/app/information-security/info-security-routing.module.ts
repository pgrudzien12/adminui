import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InfoSecurityComponent } from './info-security/info-security.component';

const routes: Routes = [
  {
    path: '',
    component: InfoSecurityComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoSecurityRoutingModule {}
