import { Subscribable } from '../base/subscribable';
import { Node } from './node.model';


export enum PinType {
  input, output, control,
}

export enum PinEvents {
  attach,
}

export class Pin extends Subscribable {
  private _node: Node;
  private _type: PinType;
  private _name: string;
  private _component: any;

  constructor(name: string, type: PinType, node?: Node) {
    super();
    this._name = name;
    this._type = type;
    this._node = node;
  }

  public get component() { return this._component; }
  public set component(comp) {
    this._component = comp;
    this.publish(PinEvents.attach, comp);
  }

  public get node() { return this._node; }
  public get type() { return this._type; }
  public get name() { return this._name; }
}
