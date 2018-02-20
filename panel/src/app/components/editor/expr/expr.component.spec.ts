import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExprComponent } from './expr.component';

describe('ExprComponent', () => {
  let component: ExprComponent;
  let fixture: ComponentFixture<ExprComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExprComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
