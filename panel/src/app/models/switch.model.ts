import { Node } from './node.model';
import { Box } from './box.model';


export enum SwitchEvents {
  addCase, removeCase,
}

export class Switch extends Node {
  public static _Target = 'target';

  constructor(box: Box) {
    super(box);
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

  public static emptySwitch(left: number, top: number): Switch {
    return new Switch(new Box(left, top, 192, 32));
  }
}
