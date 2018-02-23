import { Component, OnInit, Input } from '@angular/core';
import { Link } from '../../../models/link.model';
import { Node } from '../../../models/node.model';
import { Expr } from '../../../models/expr.model';
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
    let component = this.link.from.component;

    if (component) {
      if (this.link.from instanceof Node) {
        let box = component.box;
        if (box) return box.center;
      }

      if (this.link.from instanceof Pin) {
        return component.pos;
      }
    }

    return {
      left: 0,
      top: 0,
    }
  }

  private get _toPos() {
    let component = this.link.to.component;

    if (component) {
      if (this.link.to instanceof Node) {
          let box = component.box;
          if (box) return box.attachPoint(this.fromPos);
      }

      if (this.link.to instanceof Pin) {
        return component.pos;
      }
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

  get inPane() {
    return LinkComponent._inPane(this.link.from) &&
          LinkComponent._inPane(this.link.to);
  }

  private static _inPane(obj) {
    return (obj instanceof Node) || (obj instanceof Pin && obj.node);
  }
}
