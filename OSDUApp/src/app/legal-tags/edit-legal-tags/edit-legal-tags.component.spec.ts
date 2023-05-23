import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditLegalTagsComponent } from './edit-legal-tags.component';

describe('EditLegalTagsComponent', () => {
  let component: EditLegalTagsComponent;
  let fixture: ComponentFixture<EditLegalTagsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditLegalTagsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLegalTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
