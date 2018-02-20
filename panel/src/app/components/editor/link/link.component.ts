import { Component, OnInit, Input } from '@angular/core';
import { Link } from '../../../models/link.model';
import { Box } from '../../../models/box.model';
import { EditorService } from '../../../services/editor.service';


@Component({
  selector: 'editor-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {

  @Input() link: Link;

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
    if (this.link.from instanceof Box) return this._clientPos(this.link.from.center);
  }

  get toPos() {
    if (this.link.to instanceof Box) {
      let from = this.fromPos;
      let center = this._clientPos(this.link.to.center);

      let dl = from.left - center.left;
      let dt = from.top - center.top;
      let angle = Math.atan2(dt, dl) * 180 / Math.PI + 180;

      if (angle < 45 || angle >= 270 + 45) return this._clientPos(this.link.to.centerLeft);
      if (angle >= 45 && angle < 90 + 45) return this._clientPos(this.link.to.centerTop);
      if (angle >= 90 + 45 && angle < 180 + 45) return this._clientPos(this.link.to.centerRight);
      if (angle >= 180 + 45 && angle < 270 + 45) return this._clientPos(this.link.to.centerBottom);

      return center;
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
    console.log(`rotation(${angle}deg)`);

    return `rotate(${angle}deg)`;
  }
}
