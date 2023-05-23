import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkFlowRunComponent } from './work-flow-run.component';

describe('WorkFlowRunComponent', () => {
  let component: WorkFlowRunComponent;
  let fixture: ComponentFixture<WorkFlowRunComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WorkFlowRunComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFlowRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
