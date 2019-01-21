import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsTableComponent } from './columns-table.component';

describe('ColumnsTableComponent', () => {
  let component: ColumnsTableComponent;
  let fixture: ComponentFixture<ColumnsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
