import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodelistEntryComponent } from './nodelist-entry.component';

describe('NodelistEntryComponent', () => {
  let component: NodelistEntryComponent;
  let fixture: ComponentFixture<NodelistEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodelistEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodelistEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
