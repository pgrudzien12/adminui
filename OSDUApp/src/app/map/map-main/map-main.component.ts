import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-main',
  templateUrl: './map-main.component.html',
  styleUrls: ['./map-main.component.css'],
})
export class MapMainComponent implements OnInit {
  modalOptions: NgbModalOptions;
  listNamesWells;
  listCoordsWells;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    public cmnSrvc: CommonService,
    private restService: RestAPILayerService,
    private spinner: NgxSpinnerService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };
    this.cmnSrvc.bkgndColor = 'Maps';
  }

  map: Mapboxgl.Map;

  ngOnInit(): void {
    Mapboxgl.accessToken = environment.mapboxKey;
    console.log(Mapboxgl.accessToken);

    this.map = new Mapboxgl.Map({
      container: 'map-mapbox', // container ID
      style: 'mapbox://styles/mapbox/satellite-v9', // style URL
      center: [-0.313296, 43.31602], // LNG, LAT
      zoom: 5, // starting zoom
    });

    this.map.addControl(new Mapboxgl.NavigationControl(), 'top-left');
    this.map.addControl(new Mapboxgl.FullscreenControl(), 'top-left');

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true,
      },
    });
    this.map.addControl(draw, 'top-left');

    // this.map.on('draw.create', updateArea);
    // this.map.on('draw.delete', updateArea);
    // this.map.on('draw.update', updateArea);

    this.completeMapWithWells();
  }

  completeMapWithWells() {
    const data = {
      kind: 'osdu:wks:master-data--Well:1.0.0',
      query: 'id:"opendes:master-data--Well:W244483"',
      limit: 99,
    };

    this.restService.getDataFromSearch(data).subscribe(
      (result) => {
        this.spinner.hide();
        console.log(result);
        console.log(result.results[0].data['SpatialLocation.Wgs84Coordinates']);
        this.listCoordsWells =
          result.results[0].data[
            'SpatialLocation.Wgs84Coordinates'
          ].geometries[0].coordinates;
        this.listNamesWells = result.results[0].data['FacilityID'];
        const geojson = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [-0.313296, 43.31602], //this.listCoordsWells
              },
              properties: {
                title: this.listNamesWells,
                description: this.listNamesWells,
              },
            },
          ],
        };

        for (const feature of geojson.features) {
          // create a HTML element for each feature
          const el = document.createElement('div');
          el.className = 'marker-map';

          // make a marker for each feature and add to the map
          new Mapboxgl.Marker()
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
              new Mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                  `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                )
            )
            .addTo(this.map);
          console.log(feature.geometry.coordinates);
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }
}
