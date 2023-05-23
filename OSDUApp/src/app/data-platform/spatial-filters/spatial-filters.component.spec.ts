import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpatialFiltersComponent } from './spatial-filters.component';

describe('SpatialFiltersComponent', () => {
  let component: SpatialFiltersComponent;
  let fixture: ComponentFixture<SpatialFiltersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SpatialFiltersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpatialFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
