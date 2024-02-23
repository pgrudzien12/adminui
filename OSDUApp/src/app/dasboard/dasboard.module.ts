import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DashboardMainComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    RouterModule,
  ],
})
export class DasboardModule {}
