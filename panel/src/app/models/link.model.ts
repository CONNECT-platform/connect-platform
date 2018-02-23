import { Subscribable } from '../util/subscribable';
import { Pin } from './pin.model';


export class Link extends Subscribable {
  private _from: Pin;
  private _to: any;

  constructor(from: Pin, to) {
    super();
    this._from = from;
    this._to = to;
  }

  public get from(): Pin { return this._from; }
  public get to() { return this._to; }
}
