import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParseResultViewerComponent } from './parse-result-viewer.component';

describe('ParseResultViewerComponent', () => {
  let component: ParseResultViewerComponent;
  let fixture: ComponentFixture<ParseResultViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParseResultViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParseResultViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
