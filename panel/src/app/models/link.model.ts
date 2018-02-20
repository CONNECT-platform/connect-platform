import { Subscribable } from '../base/subscribable';


export class Link extends Subscribable {
  private _from: any;
  private _to: any;

  constructor(from, to) {
    super();
    this._from = from;
    this._to = to;
  }

  public get from() { return this._from; }
  public get to() { return this._to; }
}
