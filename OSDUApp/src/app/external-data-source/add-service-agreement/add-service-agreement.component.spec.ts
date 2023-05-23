import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddServiceAgreementComponent } from './add-service-agreement.component';

describe('AddServiceAgreementComponent', () => {
  let component: AddServiceAgreementComponent;
  let fixture: ComponentFixture<AddServiceAgreementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddServiceAgreementComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddServiceAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
