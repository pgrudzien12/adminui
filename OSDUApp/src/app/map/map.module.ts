import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapRoutingModule } from './map-routing.module';
import { MapMainComponent } from './map-main/map-main.component';

@NgModule({
  declarations: [MapMainComponent],
  imports: [CommonModule, MapRoutingModule],
})
export class MapModule {}
