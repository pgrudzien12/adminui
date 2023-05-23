import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfoSecurityComponent } from './info-security.component';

describe('InfoSecurityComponent', () => {
  let component: InfoSecurityComponent;
  let fixture: ComponentFixture<InfoSecurityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InfoSecurityComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
