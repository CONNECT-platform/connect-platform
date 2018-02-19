import { Component, OnInit } from '@angular/core';
import { EventReporter } from '../event-reporter';
import { EditorService } from '../../../services/editor.service';

@Component({
  selector: 'editor-pane',
  templateUrl: './pane.component.html',
  styleUrls: ['./pane.component.css']
})
export class PaneComponent extends EventReporter implements OnInit {

  constructor(editorService: EditorService) {
    super(editorService);
  }

  ngOnInit() {
  }

  public scrollEvent(event) {
    this.editorService.paneScrollEvent(event);
  }
}
