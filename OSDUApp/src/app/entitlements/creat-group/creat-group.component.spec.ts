import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreatGroupComponent } from './creat-group.component';

describe('CreatGroupComponent', () => {
  let component: CreatGroupComponent;
  let fixture: ComponentFixture<CreatGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreatGroupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
