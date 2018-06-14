import { Subscribable } from '../util/subscribable';
import { PinList } from './pin-list.model';
import { Box } from './box.model';
import { Pin, PinType } from './pin.model';


export enum NodeEvents {
  attach,
}

export class Node extends Subscribable {
  private _component: any;
  private _tag: string;

  private _ins: PinList;
  private _outs: PinList;
  private _controls: PinList;
  private _box: Box;

  constructor(tag: string, box: Box) {
    super();
    this._tag = tag;
    this._box = box;

    this._ins = new PinList(() => new Pin(PinType.input, this));
    this._outs = new PinList(() => new Pin(PinType.output, this));
    this._controls = new PinList(() => new Pin(PinType.control, this));
  }

  public get tag() { return this._tag; }
  public get box() { return this._box; }

  public get component() { return this._component; }
  public set component(component) {
    this._component = component;
    this.publish(NodeEvents.attach, this.component);
  }

  public relevantEvent(event): boolean {
    return event.event.tag == 'node' &&
         event.event.cascaded.tag == this.tag &&
         (event.event.cascaded.cascaded.event == 'activate' ||
         event.event.cascaded.cascaded.event == 'error' ||
         event.event.cascaded.cascaded.tag == 'out' ||
         event.event.cascaded.cascaded.tag == 'controlOut');
  }

  public get in() { return this._ins; }
  public get out() { return this._outs; }
  public get control() { return this._controls; }

  public get json() {
    return this.toJson();
  }

  protected toJson() {
    return {
      tag : this.tag,
      box : this.box.json,
    }
  }

  protected reset() {
    this.in.clear();
    this.out.clear();
    this.control.clear();
  }
}
