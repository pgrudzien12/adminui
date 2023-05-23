import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddDatajobWorkflowComponent } from './add-datajob-workflow.component';

describe('AddDatajobWorkflowComponent', () => {
  let component: AddDatajobWorkflowComponent;
  let fixture: ComponentFixture<AddDatajobWorkflowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddDatajobWorkflowComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDatajobWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
