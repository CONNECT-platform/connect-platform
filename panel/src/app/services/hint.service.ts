import { Injectable } from '@angular/core';

export enum HintType {
  _HyperText,
  _Code,
}

export class HintRef {
  constructor(
    private master: HintService,
    private _message: string,
    private _type: HintType = HintType._HyperText,
  ) { }

  public get message(): string {
    return this._message;
  }

  public get type(): HintType {
    return this._type;
  }

  public clear() {
    this.master.clear(this);
    return this;
  }
}

@Injectable()
export class HintService {

  public types = HintType;

  private refs: Array<HintRef> = [];
  private _current: HintRef;

  constructor() { }

  public get current(): HintRef {
    return this._current;
  }

  public display(message: string, type: HintType = HintType._HyperText) : HintRef {
    this._current = new HintRef(this, message, type);
    this.refs.push(this._current);
    return this._current;
  }

  public clear(ref: HintRef) {
    this.refs = this.refs.filter(_ref => _ref != ref);
    if (this.refs.length > 0) this._current = this.refs[this.refs.length - 1];
    return this;
  }

  public get visible(): boolean {
    return this.refs.length > 0;
  }
}
