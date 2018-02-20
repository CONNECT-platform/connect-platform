import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinComponent } from './pin.component';

describe('PinComponent', () => {
  let component: PinComponent;
  let fixture: ComponentFixture<PinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
