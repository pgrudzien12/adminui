import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataJoinComponent } from './data-join.component';

describe('DataJoinComponent', () => {
  let component: DataJoinComponent;
  let fixture: ComponentFixture<DataJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataJoinComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
