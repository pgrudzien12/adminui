import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';

@NgModule({
  declarations: [DashboardMainComponent],
  imports: [CommonModule, DashboardRoutingModule],
})
export class DasboardModule {}
