import { TestBed } from '@angular/core/testing';

import { DataProcessorService } from './data-processor.service';

describe('DataProcessorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataProcessorService = TestBed.get(DataProcessorService);
    expect(service).toBeTruthy();
  });
});
