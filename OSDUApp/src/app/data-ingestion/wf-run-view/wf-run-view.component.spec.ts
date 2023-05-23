import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WfRunViewComponent } from './wf-run-view.component';

describe('WfRunViewComponent', () => {
  let component: WfRunViewComponent;
  let fixture: ComponentFixture<WfRunViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WfRunViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfRunViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
