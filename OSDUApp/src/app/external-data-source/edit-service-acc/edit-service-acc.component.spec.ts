import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditServiceAccComponent } from './edit-service-acc.component';

describe('EditServiceAccComponent', () => {
  let component: EditServiceAccComponent;
  let fixture: ComponentFixture<EditServiceAccComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditServiceAccComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditServiceAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
