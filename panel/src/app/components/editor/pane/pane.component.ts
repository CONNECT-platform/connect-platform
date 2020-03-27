import { Component, OnInit, ViewChild } from '@angular/core';
import { EditorService } from '../../../services/editor.service';
import { EditorModelService } from '../../../services/editor-model.service';
import { SelectorComponent } from './selector/selector.component';


@Component({
  selector: 'editor-pane',
  templateUrl: './pane.component.html',
  styleUrls: ['./pane.component.css']
})
export class PaneComponent implements OnInit {

  @ViewChild(SelectorComponent, { static: true }) selector;

  constructor(private editor: EditorService,
              private model: EditorModelService) {
  }

  ngOnInit() {
  }

  public scrollEvent(event) {
    this.editor.paneScrollEvent(event);
  }

  public mouseDownEvent(event) {
    this.selector.mouseDownEvent(event);
  }

  public mouseMoveEvent(event) {
    this.editor.mouseMoveEvent(event);
    this.selector.mouseMoveEvent(event);
  }

  public mouseUpEvent(event) {
    this.editor.unpickEvent();
    this.selector.mouseUpEvent(event);
  }
}
