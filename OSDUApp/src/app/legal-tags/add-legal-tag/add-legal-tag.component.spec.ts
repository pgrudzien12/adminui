import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLegalTagComponent } from './add-legal-tag.component';

describe('AddLegalTagComponent', () => {
  let component: AddLegalTagComponent;
  let fixture: ComponentFixture<AddLegalTagComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddLegalTagComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLegalTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
