import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddWorkflowParameterComponent } from './add-workflow-parameter.component';

describe('AddWorkflowParameterComponent', () => {
  let component: AddWorkflowParameterComponent;
  let fixture: ComponentFixture<AddWorkflowParameterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddWorkflowParameterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkflowParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
