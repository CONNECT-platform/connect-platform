import { Component, OnInit } from '@angular/core';
import { EditorService } from '../../../../services/editor.service';
import { EditorModelService } from '../../../../services/editor-model.service';
import { Box } from '../../../../models/box.model';

@Component({
  selector: 'editor-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {

  private _origin: { x: number, y: number };
  private _box: Box;
  private _active: boolean = false;
  private _activationTime: number;

  constructor(
    private editor: EditorService,
    private model: EditorModelService,
  ) {
    this._box = new Box(0, 0, 0, 0);
  }

  ngOnInit() {
  }

  mouseDownEvent(event) {
    this._origin = this.eventPos(event);
    this.activate();
  }

  mouseMoveEvent(event) {
    if (this.active) {
      if (this.editor.isPicked()) {
        this.deactivate();
        return;
      }

      requestAnimationFrame(() => {
        let pos = this.eventPos(event)
        this._box.width = Math.abs(this._origin.x - pos.x);
        this._box.height = Math.abs(this._origin.y - pos.y);

        this._box.left = Math.min(this._origin.x, pos.x);
        this._box.top = Math.min(this._origin.y, pos.y);

        let removal = this.removalEvent(event);

        for (let node of this.model.nodes) {
          if (this._box.collides(node.box)) {
            node.component.selectionCandidate = !removal;
            node.component.deselectionCandidate = removal;
          }
          else {
            node.component.selectionCandidate = false;
            node.component.deselectionCandidate = false;
          }
        }
      });
    }
  }

  mouseUpEvent(event) {
    if (Date.now() - this._activationTime > 200 && this.active) {
      let affected = [];

      for (let node of this.model.nodes)
        if (this._box.collides(node.box))
          affected.push(node);

      let mutative = this.mutativeEvent(event);
      let removal = this.removalEvent(event);
      let previous = this.editor.selectTargets.filter(target => !affected.includes(target));
      this.editor.deselect();

      requestAnimationFrame(() => {
        if (mutative)
          for (let prev of previous) this.editor.select(prev, true);

        for (let node of affected) {
          this.editor.select(node, true);
          if (removal)
            this.editor.deselect(node);
        }

        this._box.left = this._box.top = this._box.width = this._box.height = 0;
      });
    }

    this.deactivate();
  }

  public get active(): boolean { return this._active; }

  public get transformString(): string {
    return `translateX(${this._box.left}px)` +
          ` translateY(${this._box.top}px)` +
          ` scaleX(${this._box.width / window.innerWidth})` +
          ` scaleY(${this._box.height / window.innerHeight})`
  }

  public get labelActive(): boolean {
    return this.active && this._box.width > 320 && this._box.height > 60;
  }

  public get labelTransformString(): string {
    if (this.labelActive)
      return `translateX(${this._box.center.left}px) translateY(${this._box.center.top}px)`;
    else return '';
  }

  private eventPos(event): {x: number, y: number} {
    return {
      x: event.clientX + this.editor.paneScrollAmount,
      y: event.clientY
    };
  }

  private activate() {
    this._active = true;
    this._activationTime = Date.now();
  }

  private deactivate() {
    this._active = false;

    for (let node of this.model.nodes) {
      node.component.selectionCandidate = false;
      node.component.deselectionCandidate = false;
    }
  }

  private removalEvent(event) {
    return event.ctrlKey || event.metaKey;
  }

  private mutativeEvent(event) {
    return this.removalEvent(event) || event.shiftKey;
  }
}
