import { Component, OnInit } from '@angular/core';
import { EditorService } from '../../../services/editor.service';
import { EditorModelService } from '../../../services/editor-model.service';
import { Box } from '../../../models/box.model';


@Component({
  selector: 'editor-pane',
  templateUrl: './pane.component.html',
  styleUrls: ['./pane.component.css']
})
export class PaneComponent implements OnInit {

  constructor(private editorService: EditorService,
              private model: EditorModelService) {
  }

  ngOnInit() {
  }

  public scrollEvent(event) {
    this.editorService.paneScrollEvent(event);
  }

  public mouseMoveEvent(event) {
    this.editorService.mouseMoveEvent(event);
  }

  public mouseUpEvent() {
    this.editorService.unpickEvent();
  }
}
