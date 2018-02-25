import { Node } from './node.model';
import { Box } from './box.model';


export enum SwitchEvents {
  addCase, removeCase,
}

export class Switch extends Node {
  public static _Target = 'target';

  constructor(tag: string, box: Box) {
    super(tag, box);
    this.addIn(Switch._Target);
  }

  public addCase(_case) {
    this.addControl(_case);
    this.publish(SwitchEvents.addCase, _case);
    return this;
  }

  public removeCase(_case) {
    this.removeControl(_case);
    this.publish(SwitchEvents.removeCase, _case);
    return this;
  }

  private static _count = 0;

  public static emptySwitch(left: number, top: number): Switch {
    Switch._count++;
    return new Switch(`s${Switch._count}`, new Box(left, top, 192, 32));
  }
}
