import { TestBed, inject } from '@angular/core/testing';

import { RegistryService } from './registry.service';

describe('RegistryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistryService]
    });
  });

  it('should be created', inject([RegistryService], (service: RegistryService) => {
    expect(service).toBeTruthy();
  }));
});
