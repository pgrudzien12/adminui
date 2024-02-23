import { AfterViewInit, Component, Input } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { OsduObject } from 'src/app/models/osdu-object.model';

@Component({
  selector: 'app-leaflet-map-popup',
  templateUrl: './leaflet-map-popup.component.html',
  styleUrls: ['./leaflet-map-popup.component.css'],
})
export class LeafletMapPopupComponent implements AfterViewInit {
  @Input() osduObject: OsduObject;

  country: String = 'Unknown';

  verticalCRS: String = 'Unknown';

  constructor(private cmnsrvc: CommonService) {}

  ngAfterViewInit(): void {
    this.getCountry();
  }

  getCountry() {
    const geocontexts: Array<any> = this.osduObject.data.GeoContexts;

    if (!geocontexts) return;

    const geocontext = geocontexts.find((el) =>
      el.GeoTypeID?.includes('GeoPoliticalEntityType:Country')
    );

    if (!geocontext) return;

    this.country = this.cmnsrvc.cleanAttributeID(
      geocontext['GeoPoliticalEntityID']
    );

    const verticalCRS = this.osduObject.data.VerticalMeasurements?.find(
      (el) => !!el.VerticalCRSID
    )?.VerticalCRSID;

    if (verticalCRS)
      this.verticalCRS = this.cmnsrvc.cleanAttributeID(verticalCRS);
  }
}
