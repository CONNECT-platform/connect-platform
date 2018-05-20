import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HintmanComponent } from './hintman.component';

describe('HintmanComponent', () => {
  let component: HintmanComponent;
  let fixture: ComponentFixture<HintmanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HintmanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HintmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
