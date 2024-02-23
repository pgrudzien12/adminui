import {
  AfterViewInit,
  Component,
  ComponentRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import * as L from 'leaflet';
import { OsduObject } from 'src/app/models/osdu-object.model';
import { LeafletMapPopupComponent } from '../leaflet-map-popup/leaflet-map-popup.component';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css'],
  entryComponents: [LeafletMapPopupComponent],
})
export class LeafletMapComponent implements AfterViewInit, OnChanges {
  private map;

  private markers = [];

  popupComponents: ComponentRef<LeafletMapPopupComponent>[] = [];

  @Input() osduObjects: OsduObject[] = [];

  @ViewChild('popupContainer', { read: ViewContainerRef })
  popupContainer: ViewContainerRef;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [43.31602, -0.313296],
      zoom: 1,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);

    this.addWellsToMap();
  }

  addWellsToMap() {
    this.osduObjects.forEach((res) => {
      if (res.data && res.data['SpatialLocation.Wgs84Coordinates']) {
        const spatialData = res.data['SpatialLocation.Wgs84Coordinates'];
        // Check if spatialData.features exists and is an array
        if (spatialData.geometries && Array.isArray(spatialData.geometries)) {
          // Inner loop: iterate over all geometries
          spatialData.geometries.forEach((geometry) => {
            if (geometry?.type !== 'point') return;
            this.addMarkerToMap(geometry, res);
          });
        }
      }
    });
  }

  flyToObject(osduObject: OsduObject) {
    this.map.eachLayer((layer) => {
      const layerId = layer.options?.objectId;

      if (!layerId || layerId !== osduObject.id) return;

      const lat = layer._latlng.lat;
      const lng = layer._latlng.lng;

      this.map.flyTo([lat, lng], 10);

      layer.openPopup();
    });
  }

  private addMarkerToMap(geometry, object: OsduObject) {
    const marker = L.marker(
      [geometry.coordinates[1], geometry.coordinates[0]],
      {
        objectId: object.id,
      }
    );

    const popupComponent = this.popupContainer.createComponent(
      LeafletMapPopupComponent
    );

    popupComponent.instance.osduObject = object;

    this.popupComponents.push(popupComponent);

    marker.bindPopup(popupComponent.location.nativeElement);

    this.markers.push(marker);

    marker.addTo(this.map);
  }

  private clearMarkers() {
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker);
    });

    this.markers = [];

    this.popupComponents.forEach((popupComponent) => {
      popupComponent.destroy();
    });

    this.popupComponents = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.osduObjects || changes.osduObjects.firstChange) return;

    this.clearMarkers();

    this.addWellsToMap();
  }
}
