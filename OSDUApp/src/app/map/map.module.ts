import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapRoutingModule } from './map-routing.module';
import { MapMainComponent } from './map-main/map-main.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeafletMapComponent } from './components/leaflet-map/leaflet-map.component';
import { LeafletMapPopupComponent } from './components/leaflet-map-popup/leaflet-map-popup.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule as AdminUICommonModule } from '../common/common.module';
import { MatCardModule } from '@angular/material/card';
import { DataPlatformModule } from '../data-platform/data-platform.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    MapMainComponent,
    LeafletMapComponent,
    LeafletMapPopupComponent,
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    AdminUICommonModule,
    MatCardModule,
    DataPlatformModule,
    MatExpansionModule,
    NgxSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
})
export class MapModule {}
