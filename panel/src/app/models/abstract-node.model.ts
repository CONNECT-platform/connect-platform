import { Subscribable } from '../util/subscribable';

export abstract class AbstractNode extends Subscribable {
  private _tag: string;

  public constructor(_tag: string) {
    super();
    this._tag = _tag;
  }

  public get tag(): string { return this._tag; }
  public abstract is(type: string): boolean;
}
