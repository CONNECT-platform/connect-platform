import { Injectable } from '@angular/core';

export class HintRef {
  constructor(
    private master: HintService,
    private _message: string
  ) { }

  public get message(): string {
    return this._message;
  }

  public clear() {
    this.master.clear(this);
    return this;
  }
}

@Injectable()
export class HintService {

  private refs: Array<HintRef> = [];
  private msg: string;

  constructor() { }

  public get message(): string {
    return this.msg;
  }

  public display(message: string) : HintRef {
    let ref = new HintRef(this, message);
    this.refs.push(ref);
    this.msg = message;
    return ref;
  }

  public clear(ref: HintRef) {
    this.refs = this.refs.filter(_ref => _ref != ref);
    if (this.refs.length > 0) this.msg = this.refs[this.refs.length - 1].message;
    return this;
  }

  public get visible(): boolean {
    return this.refs.length > 0;
  }
}
