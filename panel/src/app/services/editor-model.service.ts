import { Injectable } from '@angular/core';
import { Subscribable } from '../util/subscribable';
import { Node } from '../models/node.model';
import { Link } from '../models/link.model';
import { Pin, PinType } from '../models/pin.model';
import { PinList } from '../models/pin-list.model';
import { Signature } from '../models/signature.model';


export enum EditorModelEvents {
  pathChange, methodChange, accessChange,
  addNode, removeNode,
  addLink, removeLink,
}

@Injectable()
export class EditorModelService extends Subscribable {
  private _signature: Signature = {
      path: '/some-path/',
      method: 'GET',
      public: false,
      inputs: [],
      outputs: [],
      controlOutputs: [],
      configs: [],
  };

  private _nodes: Array<Node> = [];
  private _links: Array<Link> = [];

  private _ins: PinList;
  private _outs: PinList;
  private _confs: PinList;
  private _ctrls: PinList;

  constructor() {
    super();
    this._ins = new PinList(() => new Pin(PinType.output));
    this._confs = new PinList(() => new Pin(PinType.output));
    this._outs = new PinList(() => new Pin(PinType.input));
    this._ctrls = new PinList(() => new Pin(PinType.input));

    this._buildPins();
  }

  public get signature(): Signature { return this._signature; }
  public get path(): string { return this._signature.path; }
  public get method(): string { return this._signature.method.toUpperCase(); }
  public get public(): boolean { return this._signature.public; }

  public get in(): PinList { return this._ins; }
  public get config(): PinList { return this._confs; }
  public get out(): PinList { return this._outs; }
  public get control(): PinList { return this._ctrls; }

  public get nodes(): Array<Node> { return this._nodes; }
  public get links(): Array<Link> { return this._links; }

  public set path(path: string) {
    this._signature.path = path;
    this.publish(EditorModelEvents.pathChange, path);
  }

  public set method(method: string) {
    this._signature.method = method;
    this.publish(EditorModelEvents.methodChange, method);
  }

  public set public(_public: boolean) {
    this._signature.public = _public;
    this.publish(EditorModelEvents.accessChange, _public);
  }

  public adopt(signature: Signature) {
    this.path = signature.path;
    this.method = signature.method;
    this.public = signature.public;

    this._signature.inputs = signature.inputs;
    this._signature.outputs = signature.outputs;
    this._signature.controlOutputs = signature.controlOutputs;
    this._signature.configs = signature.configs;

    this._buildPins();
  }

  public addNode(node: Node): EditorModelService {
    this._nodes.push(node);
    this.publish(EditorModelEvents.addNode, node);
    return this;
  }

  public removeNode(node: Node): EditorModelService {
    this._nodes = this._nodes.filter(n => n != node);
    this.publish(EditorModelEvents.removeNode, node);
    return this;
  }

  public addLink(link: Link): EditorModelService {
    this._links.push(link);
    this.publish(EditorModelEvents.addLink, link);
    return this;
  }

  public removeLink(link: Link): EditorModelService {
    this._links = this._links.filter(l => l != link);
    this.publish(EditorModelEvents.removeLink, link);
    return this;
  }

  private _buildPins() {
    this.in.clear();
    this.config.clear();
    this.out.clear();
    this.control.clear();

    for (let _in of this.signature.inputs) this.in.add(_in);
    for (let _conf of this.signature.configs) this.config.add(_conf);
    for (let _out of this.signature.outputs) this.out.add(_out);
    for (let _ctrl of this.signature.controlOutputs) this.control.add(_ctrl);
  }
}
