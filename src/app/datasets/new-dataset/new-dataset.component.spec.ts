import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDatasetComponent } from './new-dataset.component';

describe('FileLoadComponent', () => {
  let component: NewDatasetComponent;
  let fixture: ComponentFixture<NewDatasetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDatasetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
