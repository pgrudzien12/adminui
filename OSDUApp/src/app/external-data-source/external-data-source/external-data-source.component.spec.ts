import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExternalDataSourceComponent } from './external-data-source.component';

describe('ExternalDataSourceComponent', () => {
  let component: ExternalDataSourceComponent;
  let fixture: ComponentFixture<ExternalDataSourceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalDataSourceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalDataSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
