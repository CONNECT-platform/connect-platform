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

  protected toJson() {
    return Object.assign(super.toJson(), {
      cases : this.cases.items.map(i => i.label),
    });
  }

  public static emptySwitch(tag: string, left: number, top: number): Switch {
    let sw = new Switch(tag, new Box(left, top, 144, 32));
    sw.cases.add('true');
    sw.cases.add('false');
    return sw;
  }
}
