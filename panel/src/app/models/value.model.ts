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

  public static emptyValue(left: number, top: number): Expr {
    return new Value(new Box(left, top, 192, 32));
  }
}
