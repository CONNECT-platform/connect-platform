import { EditorService } from '../../services/editor.service';


export class EventReporter {
  constructor(protected editorService: EditorService) {}

  public mouseMoveEvent(event) { this.editorService.mouseMoveEvent(event); }
}
