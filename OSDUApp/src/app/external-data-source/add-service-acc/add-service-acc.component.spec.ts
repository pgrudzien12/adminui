import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddServiceAccComponent } from './add-service-acc.component';

describe('AddServiceAccComponent', () => {
  let component: AddServiceAccComponent;
  let fixture: ComponentFixture<AddServiceAccComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddServiceAccComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddServiceAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
