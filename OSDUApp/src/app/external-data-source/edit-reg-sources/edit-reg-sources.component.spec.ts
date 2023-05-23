import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditRegSourcesComponent } from './edit-reg-sources.component';

describe('EditRegSourcesComponent', () => {
  let component: EditRegSourcesComponent;
  let fixture: ComponentFixture<EditRegSourcesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditRegSourcesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRegSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
