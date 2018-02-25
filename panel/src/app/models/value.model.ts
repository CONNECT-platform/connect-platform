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

  private static _value_count = 0;

  public static emptyValue(left: number, top: number): Value {
    Value._value_count++;
    return new Value(`v${Value._value_count}`, new Box(left, top, 192, 32));
  }
}
