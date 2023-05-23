import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkflowRunDetailsComponent } from './workflow-run-details.component';

describe('WorkflowRunDetailsComponent', () => {
  let component: WorkflowRunDetailsComponent;
  let fixture: ComponentFixture<WorkflowRunDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowRunDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowRunDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
