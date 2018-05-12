import { TestBed, inject } from '@angular/core/testing';

import { TesterService } from './tester.service';

describe('TesterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TesterService]
    });
  });

  it('should be created', inject([TesterService], (service: TesterService) => {
    expect(service).toBeTruthy();
  }));
});
