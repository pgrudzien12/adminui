import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LegalTagsComponent } from './legal-tags/legal-tags.component';
import { StorageComponent } from './storage/storage.component';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: LegalTagsComponent,
    children: [
      {
        path: 'storage',
        component: StorageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalTagsRoutingModule {}
