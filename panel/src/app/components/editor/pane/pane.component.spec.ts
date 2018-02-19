import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaneComponent } from './pane.component';

describe('PaneComponent', () => {
  let component: PaneComponent;
  let fixture: ComponentFixture<PaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
