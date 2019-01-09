import { Subscribable } from '../util/subscribable';
import { elementBox } from '../util/elem-box';


export enum BoxEvents {
  anchor, move
}

export interface BoxJson {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export class Box extends Subscribable {
  private _left: number;
  private _top: number;
  private _width: number;
  private _height: number;
  private _anchor: any;

  constructor(left, top, width, height) {
    super();
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
  }

  public get left() { return this._left; }
  public get top() { return this._top; }
  public get width() { return this._width; }
  public get height() { return this._height; }
  public get right() { return this.left + this.width; }
  public get bottom() { return this.top + this.height; }

  public get center() {
    return {
      left: this.left + this.width / 2,
      top: this.top + this.height / 2,
    }
  }

  public get centerLeft() { return { left: this.left, top: this.center.top, } }
  public get centerRight() { return { left: this.right, top: this.center.top, } }
  public get centerTop() { return { top: this.top, left: this.center.left, } }
  public get centerBottom() { return { top: this.bottom, left: this.center.left, } }

  public get topLeft() { return { left: this.left, top: this.top } }
  public get topRight() { return { left: this.right, top: this.top } }
  public get bottomLeft() { return { left: this.left, top: this.bottom } }
  public get bottomRight() { return { left: this.right, top: this.bottom } }

  public set left(_left) { this._left = _left; }
  public set top(_top) { this._top = _top; }
  public set width(_width) { this._width = _width; }
  public set height(_height) { this._height = _height; }

  public get anchor() { return this._anchor || this.center; }

  public attachPoint(viewPoint: {left: number, top: number},
                    margin?: {left?: number, top?: number, right?: number, bottom?:number}) {
    let center = this.center;
    let dl = viewPoint.left - center.left;
    let dt = viewPoint.top - center.top;
    let angle = Math.atan2(dt, dl) * 180 / Math.PI + 180;

    if (angle < 45 || angle >= 270 + 45) {
      let attach = this.centerLeft;
      if (margin && margin.left) attach.left -= margin.left;
      return attach;
    }

    if (angle >= 45 && angle < 90 + 45) {
      let attach = this.centerTop;
      if (margin && margin.top) attach.top -= margin.top;
      return attach;
    }

    if (angle >= 90 + 45 && angle < 180 + 45) {
      let attach = this.centerRight;
      if (margin && margin.right) attach.left += margin.right;
      return attach;
    }

    if (angle >= 180 + 45 && angle < 270 + 45) {
      let attach = this.centerBottom;
      if (margin && margin.bottom) attach.top += margin.bottom;
      return attach;
    }

    return center;
  }

  public includes(point: { top: number, left: number }) {
    return this.top <= point.top && this.bottom >= point.top &&
          this.left <= point.left && this.right >= point.left;
  }

  public collides(box: Box) {
    return this.left <= box.right && this.right >= box.left &&
            this.top <= box.bottom && this.bottom >= box.top;
  }

  public pick(_anchor, ref?): Box {
    this._anchor = _anchor;
    this.publish(BoxEvents.anchor, this._anchor);
    return this;
  }

  public move(_pos, relative: boolean = false) {
    let _ogleft = this.left;
    let _ogtop = this.top;

    if (!relative) {
      this.left = _pos.left - this.anchor.left;
      this.top = _pos.top - this.anchor.top;
    }
    else {
      this.left += _pos.left;
      this.top += _pos.top;
    }

    this.publish(BoxEvents.move, {left: this.left, top: this.top});

    return {
      left: this.left - _ogleft,
      top: this.top - _ogtop,
    };
  }

  public get json(): BoxJson {
    return {
      left : this.left,
      right : this.right,
      top : this.top,
      bottom : this.bottom,
    }
  }

  public static fromElement(el) {
    let _box = elementBox(el);
    return new Box(_box.left, _box.top, _box.right - _box.left, _box.bottom - _box.top);
  }

  public static fromJson(json: BoxJson) {
    return new Box(json.left, json.top, json.right - json.left, json.bottom - json.top);
  }
}
