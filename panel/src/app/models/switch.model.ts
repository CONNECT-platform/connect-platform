import { Node } from './node.model';
import { Box } from './box.model';


export class Switch extends Node {
  public static _Target = 'target';

  constructor(tag: string, box: Box) {
    super(tag, box);
    this.in.add(Switch._Target);
  }

  public get target() { return this.in.get(Switch._Target); }
  public get cases() { return this.control; }

  private static _count = 0;

  public static emptySwitch(left: number, top: number): Switch {
    Switch._count++;
    let sw = new Switch(`s${Switch._count}`, new Box(left, top, 144, 32));
    sw.cases.add('true');
    sw.cases.add('false');
    return sw;
  }
}
