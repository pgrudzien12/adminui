import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdutiAndMetricComponent } from './aduti-and-metric.component';

describe('AdutiAndMetricComponent', () => {
  let component: AdutiAndMetricComponent;
  let fixture: ComponentFixture<AdutiAndMetricComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdutiAndMetricComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdutiAndMetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
