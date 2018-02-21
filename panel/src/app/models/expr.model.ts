import { Node } from './node.model';
import { Box } from './box.model';


export enum ExprEvents {
  codeChange,
}

export class Expr extends Node {
  public static Result: string = 'result';

  private _code: string;

  constructor(box: Box) {
    super(box);
    this.addOut(Expr.Result);
  }

  public get code() { return this._code; }
  public set code(code) {
    this._code = code;
    this.publish(ExprEvents.codeChange, code);
  }

  public static emptyExpr(left: number, top: number): Expr {
    return new Expr(new Box(left, top, 192, 32));
  }
}
