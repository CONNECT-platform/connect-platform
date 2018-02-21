import { Component, OnInit, Input } from '@angular/core';
import { Link } from '../../../models/link.model';
import { Node } from '../../../models/node.model';
import { Pin } from '../../../models/pin.model';
import { EditorService } from '../../../services/editor.service';


@Component({
  selector: 'editor-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {

  @Input() link: Link;
  private _lastFromPos = null;
  private _lastToPos = null;

  constructor(private editorService: EditorService) { }

  ngOnInit() {
  }

  private _clientPos(pos) {
    return {
      left: pos.left - this.editorService.paneScrollAmount,
      top: pos.top
    }
  }

  get fromPos() {
    if (!this._lastFromPos) {
      this._lastFromPos = this._fromPos;
      setTimeout(() => this._lastFromPos = null, 10);
    }
    return this._lastFromPos;
  }

  get toPos() {
    if (!this._lastToPos) {
      this._lastToPos = this._toPos;
      setTimeout(() => this._lastToPos = null, 10);
    }
    return this._lastToPos;
  }

  private get _fromPos() {
    if (this.link.from instanceof Node) return this._clientPos(this.link.from.box.center);
    if (this.link.from instanceof Pin && this.link.from.component) {
      return this.link.from.component.pos;
    }

    return {
      left: 0,
      top: 0,
    }
  }

  private get _toPos() {
    if (this.link.to instanceof Node) {
      let from = this.fromPos;
      let center = this._clientPos(this.link.to.box.center);

      let dl = from.left - center.left;
      let dt = from.top - center.top;
      let angle = Math.atan2(dt, dl) * 180 / Math.PI + 180;

      if (angle < 45 || angle >= 270 + 45) return this._clientPos(this.link.to.box.centerLeft);
      if (angle >= 45 && angle < 90 + 45) return this._clientPos(this.link.to.box.centerTop);
      if (angle >= 90 + 45 && angle < 180 + 45) return this._clientPos(this.link.to.box.centerRight);
      if (angle >= 180 + 45 && angle < 270 + 45) return this._clientPos(this.link.to.box.centerBottom);

      return center;
    }

    if (this.link.to instanceof Pin && this.link.to.component) {
      return this.link.to.component.pos;
    }

    return {
      left: 0,
      top: 0,
    }
  }

  get linkWidth() {
    let from = this.fromPos;
    let to = this.toPos;
    let dl = (from.left - to.left);
    let dt = (from.top - to.top);
    return Math.sqrt(dl * dl + dt * dt);
  }

  get linkTransform() {
    let from = this.fromPos;
    let to = this.toPos;
    let dl = (from.left - to.left);
    let dt = (from.top - to.top);
    let angle = Math.atan2(dt, dl) * 180 / Math.PI + 180;

    return `rotate(${angle}deg)`;
  }
}
