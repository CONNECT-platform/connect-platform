import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorMiscOverlayComponent } from './editor-misc-overlay.component';

describe('EditorMiscOverlayComponent', () => {
  let component: EditorMiscOverlayComponent;
  let fixture: ComponentFixture<EditorMiscOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorMiscOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorMiscOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
