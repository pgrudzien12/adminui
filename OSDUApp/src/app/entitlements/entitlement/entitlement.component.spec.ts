import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntitlementComponent } from './entitlement.component';

describe('EntitlementComponent', () => {
  let component: EntitlementComponent;
  let fixture: ComponentFixture<EntitlementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EntitlementComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
