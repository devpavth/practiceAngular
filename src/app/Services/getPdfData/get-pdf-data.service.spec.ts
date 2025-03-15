import { TestBed } from '@angular/core/testing';

import { GetPdfDataService } from './get-pdf-data.service';

describe('GetPdfDataService', () => {
  let service: GetPdfDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPdfDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
