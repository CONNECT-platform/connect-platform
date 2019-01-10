import { Node, NodeJson } from './node.model';
import { Box } from './box.model';


export interface SwitchJson extends NodeJson {
  cases?: string[];
}

export class Switch extends Node {
  public static _Target = 'target';

  constructor(tag: string, box: Box) {
    super(tag, box);
    this.in.add(Switch._Target);
  }

  public get target() { return this.in.get(Switch._Target); }
  public get cases() { return this.control; }

  protected toJson(): SwitchJson {
    return Object.assign(super.toJson(), {
      cases : this.cases.items.map(i => i.label),
    });
  }

  public static emptySwitch(tag: string, left: number, top: number): Switch {
    let sw = new Switch(tag, new Box(left || 256, top || 256, 144, 32));
    sw.cases.add('true');
    sw.cases.add('false');
    return sw;
  }

  public static fromJson(json: SwitchJson) {
    let sw = new Switch(json.tag, Box.fromJson(json.box));
    for (let c of json.cases) {
      sw.cases.add(c);
    }

    return sw;
  }

  public is(type: string): boolean {
    if (type === 'switch') return true;
    else return super.is(type);
  }
}
