import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapMainComponent } from './map-main.component';

describe('MapMainComponent', () => {
  let component: MapMainComponent;
  let fixture: ComponentFixture<MapMainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MapMainComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
