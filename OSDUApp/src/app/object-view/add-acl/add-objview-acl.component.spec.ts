import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddACLObjViewComponent } from './add-objview-acl.component';

describe('AddACLComponent', () => {
  let component: AddACLObjViewComponent;
  let fixture: ComponentFixture<AddACLObjViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddACLObjViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddACLObjViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
