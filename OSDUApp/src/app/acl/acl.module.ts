import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { AclRoutingModule } from './acl-routing.module';
import { ManageDataGroupComponent } from './manage-data-group/manage-data-group.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '../common/common.module';
import { DataPlatformModule } from '../data-platform/data-platform.module';
import { DeleteFromDatagroupComponent } from './delete-from-datagroup/delete-from-datagroup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [ManageDataGroupComponent, DeleteFromDatagroupComponent],
  imports: [
    NgCommonModule,
    AclRoutingModule,
    MatCardModule,
    CommonModule,
    DataPlatformModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatListModule,
  ],
})
export class AclModule {}
