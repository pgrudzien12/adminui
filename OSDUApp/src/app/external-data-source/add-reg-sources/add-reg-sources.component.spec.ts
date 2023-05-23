import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddRegSourcesComponent } from './add-reg-sources.component';

describe('AddRegSourcesComponent', () => {
  let component: AddRegSourcesComponent;
  let fixture: ComponentFixture<AddRegSourcesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddRegSourcesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRegSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
