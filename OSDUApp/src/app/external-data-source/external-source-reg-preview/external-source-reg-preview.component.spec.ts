import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExternalSourceRegPreviewComponent } from './external-source-reg-preview.component';

describe('ExternalSourceRegPreviewComponent', () => {
  let component: ExternalSourceRegPreviewComponent;
  let fixture: ComponentFixture<ExternalSourceRegPreviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalSourceRegPreviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalSourceRegPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
