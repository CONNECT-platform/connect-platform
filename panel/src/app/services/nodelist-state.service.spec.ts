import { TestBed, inject } from '@angular/core/testing';

import { NodelistStateService } from './nodelist-state.service';

describe('NodelistStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NodelistStateService]
    });
  });

  it('should be created', inject([NodelistStateService], (service: NodelistStateService) => {
    expect(service).toBeTruthy();
  }));
});
