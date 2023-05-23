import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchQueryComponent } from './search-query.component';

describe('ObjectViewMainComponent', () => {
  let component: SearchQueryComponent;
  let fixture: ComponentFixture<SearchQueryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchQueryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
