import { AutofocusDirective } from './autofocus.directive';
import { ElementRef } from '@angular/core';

class MockElementRef extends ElementRef {
  constructor() { super(undefined); }
  // nativeElement = {};
}

describe('AutofocusDirective', () => {
  it('should create an instance', () => {
    const directive = new AutofocusDirective(new MockElementRef());
    expect(directive).toBeTruthy();
  });
});
