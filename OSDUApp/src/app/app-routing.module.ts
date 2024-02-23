import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { RoutesService } from './common/routes.service';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dasboard/dasboard.module').then((m) => m.DasboardModule),
    canActivate: [MsalGuard],
  },
  {
    path: 'entitlement',
    loadChildren: () =>
      import('./entitlements/entitlements.module').then(
        (m) => m.EntitlementsModule
      ),
    canActivate: [MsalGuard],
  },
  {
    path: 'acl',
    loadChildren: () => import('./acl/acl.module').then((m) => m.AclModule),
    canActivate: [MsalGuard],
  },
  {
    path: 'audit-metrics',
    loadChildren: () =>
      import('./audit-metrics/audit-metrics.module').then(
        (m) => m.AuditMetricsModule
      ),
    canActivate: [MsalGuard],
  },
  {
    path: 'data-ingestion',
    loadChildren: () =>
      import('./data-ingestion/data-ingestion.module').then(
        (m) => m.DataIngestionModule
      ),
    canActivate: [MsalGuard],
  },
  {
    path: 'data-loading',
    loadChildren: () =>
      import('./data-loading/data-loading.module').then(
        (m) => m.DataLoadingModule
      ),
    canActivate: [MsalGuard],
  },
  {
    path: 'search-kind',
    loadChildren: () =>
      import('./search-kind/search-kind.module').then(
        (m) => m.SearchKindModule
      ),
    canActivate: [MsalGuard],
  },
  {
    path: 'search-query',
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchModule),
    canActivate: [MsalGuard],
  },
  {
    path: 'object-view',
    loadChildren: () =>
      import('./object-view/object-view.module').then(
        (m) => m.ObjectViewModule
      ),
    canActivate: [MsalGuard],
  },
  {
    path: 'ref-data',
    loadChildren: () =>
      import('./ref-data/ref-data.module').then((m) => m.RefDataMudule),
    canActivate: [MsalGuard],
  },
  {
    path: 'info-security',
    loadChildren: () =>
      import('./information-security/information-security.module').then(
        (m) => m.InformationSecurityModule
      ),
    canActivate: [MsalGuard],
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then((m) => m.MapModule),
    data: { title: RoutesService.PAGE_TITLES.map },
    canActivate: [MsalGuard],
  },
  {
    path: 'EDS',
    loadChildren: () =>
      import('./external-data-source/external-data-source.module').then(
        (m) => m.ExternalDataSourceModule
      ),
    data: { title: RoutesService.PAGE_TITLES.externalDataSource },
    canActivate: [MsalGuard],
  },
  {
    path: 'legal-tags',
    loadChildren: () =>
      import('./legal-tags/legal-tags.module').then((m) => m.LegalTagsModule),
    canActivate: [MsalGuard],
    data: { title: RoutesService.PAGE_TITLES.legalTags },
  },
  {
    path: 'join-data',
    loadChildren: () =>
      import('./join-wellbore-data/join-wellbore-data.module').then(
        (m) => m.JoinWellboreDataModule
      ),
    canActivate: [MsalGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
  providers: [MsalGuard],
})
export class AppRoutingModule {}
