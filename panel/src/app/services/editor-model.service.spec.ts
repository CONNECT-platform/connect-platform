import { TestBed, inject } from '@angular/core/testing';

import { EditorModelService } from './editor-model.service';

describe('EditorModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditorModelService]
    });
  });

  it('should be created', inject([EditorModelService], (service: EditorModelService) => {
    expect(service).toBeTruthy();
  }));
});
