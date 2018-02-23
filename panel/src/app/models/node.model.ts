import { Subscribable } from '../util/subscribable';
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
  private _ins = [];
  private _outs = [];
  private _controls = [];
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
    this._ins.push({label: _in, pin: new Pin(PinType.input, this)});
    this.publish(NodeEvents.addIn, _in);
    return this;
  }

  public removeIn(_in: string): Node {
    this._ins = this._ins.filter(i => i.label != _in);
    this.publish(NodeEvents.removeIn, _in);
    return this;
  }

  public getIn(_in: string) {
    let _search = this.in.filter(i => i.label == _in);
    if (_search.length > 0) return _search[0];
  }

  public addOut(_out: string): Node {
    this._outs.push({label: _out, pin: new Pin(PinType.output, this)});
    this.publish(NodeEvents.addOut, _out);
    return this;
  }

  public removeOut(_out: string): Node {
    this._outs = this._outs.filter(o => o.label != _out);
    this.publish(NodeEvents.removeOut, _out);
    return this;
  }

  public getOut(_out: string) {
    let _search = this.out.filter(o => o.label == _out);
    if (_search.length > 0) return _search[0];
  }

  public addControl(_ctrl: string): Node {
    this._controls.push({label: _ctrl, pin: new Pin(PinType.control, this)});
    this.publish(NodeEvents.addControl, _ctrl);
    return this;
  }

  public removeControl(_ctrl: string): Node {
    this._controls = this._controls.filter(c => c.label != _ctrl);
    this.publish(NodeEvents.removeControl, _ctrl);
    return this;
  }

  public getControl(_ctrl: string) {
    let _search = this.control.filter(c => c.label == _ctrl);
    if (_search.length > 0) return _search[0];
  }
}
