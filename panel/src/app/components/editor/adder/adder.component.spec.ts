import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdderComponent } from './adder.component';

describe('AdderComponent', () => {
  let component: AdderComponent;
  let fixture: ComponentFixture<AdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
