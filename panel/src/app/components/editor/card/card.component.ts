import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { EditorService, EditorEvents } from '../../../services/editor.service';
import { EventReporter } from '../event-reporter';

@Component({
  selector: 'editor-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent extends EventReporter implements OnInit, OnDestroy {

  @Input() private x: number = 0;
  @Input() private y: number = 0;

  private picked: any;

  private mouseMoveHandler;

  constructor(editorService: EditorService) {
    super(editorService);
  }

  ngOnInit() {
    this.mouseMoveHandler = event => {
      if (this.picked)
        this.move(event.x - this.picked.x, event.y - this.picked.y);
    };
    this.editorService.subscribe(EditorEvents.mousemove, this.mouseMoveHandler);
  }

  ngOnDestroy() {
    this.editorService.unsubscribe(EditorEvents.mousemove, this.mouseMoveHandler);
  }

  public move(x, y) {
    this.x = x;
    this.y = y;
  }

  public pick(event) {
    this.picked = {
      x: event.offsetX,
      y: event.offsetY,
    }
  }

  public unpick() {
    this.picked = null;
  }
}
