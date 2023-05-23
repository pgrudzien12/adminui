import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditMetricRoutingModule } from './audit-metric-routing.module';
import { AdutiAndMetricComponent } from './aduti-and-metric/aduti-and-metric.component';

@NgModule({
  declarations: [AdutiAndMetricComponent],
  imports: [CommonModule, AuditMetricRoutingModule],
})
export class AuditMetricsModule {}
