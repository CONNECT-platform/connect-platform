import { Subscribable } from '../util/subscribable';
import { Node } from './node.model';


export enum PinType {
  input, output, control,
}

export enum PinEvents {
  attach,
}

export class Pin extends Subscribable {
  public types = PinType;

  private _node: Node;
  private _type: PinType;
  private _component: any;

  constructor(type: PinType, node?: Node) {
    super();
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
}
