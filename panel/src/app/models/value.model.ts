import { Expr } from './expr.model';
import { Box } from './box.model';


export enum ValueEvents {
  codeChange,
}

export class Value extends Expr {
  public set code(code : string) {
    super._setCode(code);
    this.publish(ValueEvents.codeChange, code);
  }

  public get code() { return this._getCode(); }

  public static emptyValue(tag: string, left: number, top: number): Value {
    let value = new Value(tag, new Box(left, top, 172, 32));
    value.code = '//something ...';
    return value;
  }
}
