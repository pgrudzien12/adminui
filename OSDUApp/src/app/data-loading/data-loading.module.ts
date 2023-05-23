import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLoadingComponent } from './data-loading/data-loading.component';
import { DataLoadingRoutingModule } from './data-loading-routing.module';

@NgModule({
  declarations: [DataLoadingComponent],
  imports: [CommonModule, DataLoadingRoutingModule],
})
export class DataLoadingModule {}
