import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EdsDatajobComponent } from './eds-datajob.component';

describe('EdsDatajobComponent', () => {
  let component: EdsDatajobComponent;
  let fixture: ComponentFixture<EdsDatajobComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EdsDatajobComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdsDatajobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
