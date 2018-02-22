import { Subscribable } from '../base/subscribable';
import { Box } from './box.model';
import { Pin, PinType } from './pin.model';


export enum NodeEvents {
  attach,
  addIn, removeIn,
  addOut, removeOut,
  addControl, removeControl,
}

export class Node extends Subscribable {
  private _component: any;
  private _ins = {};
  private _outs = {};
  private _controls = {};
  private _box: Box;

  constructor(box: Box) {
    super();
    this._box = box;
  }

  public get box() { return this._box; }

  public get component() { return this._component; }
  public set component(component) {
    this._component = component;
    this.publish(NodeEvents.attach, this.component);
  }

  public get in() { return this._ins; }
  public get out() { return this._outs; }
  public get control() { return this._controls; }

  public addIn(_in: string): Node {
    this._ins[_in] = new Pin(PinType.input, this);
    this.publish(NodeEvents.addIn, _in);
    return this;
  }

  public renameIn(oldName: string, newName: string): Node {
    if (oldName != newName && oldName in this._ins) {
      this._ins[newName] = this._ins[oldName];
      delete this._ins[oldName];
    }
    return this;
  }

  public removeIn(_in: string): Node {
    delete this._ins[_in];
    this.publish(NodeEvents.removeIn, _in);
    return this;
  }

  public addOut(_out: string): Node {
    this._outs[_out] = new Pin(PinType.output, this);
    this.publish(NodeEvents.addOut, _out);
    return this;
  }

  public removeOut(_out: string): Node {
    delete this._outs[_out];
    this.publish(NodeEvents.removeOut, _out);
    return this;
  }

  public addControl(_ctrl: string): Node {
    this._controls[_ctrl] = new Pin(PinType.control, this);
    this.publish(NodeEvents.addControl, _ctrl);
    return this;
  }

  public removeControl(_ctrl: string): Node {
    delete this._controls[_ctrl];
    this.publish(NodeEvents.removeControl, _ctrl);
    return this;
  }
}
