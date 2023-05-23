import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectDownloadComponent } from './select-download.component';

describe('AddACLComponent', () => {
  let component: SelectDownloadComponent;
  let fixture: ComponentFixture<SelectDownloadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectDownloadComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
