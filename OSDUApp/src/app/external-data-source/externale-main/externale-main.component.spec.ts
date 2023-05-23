import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExternaleMainComponent } from './externale-main.component';

describe('ExternaleMainComponent', () => {
  let component: ExternaleMainComponent;
  let fixture: ComponentFixture<ExternaleMainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExternaleMainComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternaleMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
