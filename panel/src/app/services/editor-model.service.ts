import { Injectable } from '@angular/core';
import { Subscribable } from '../util/subscribable';
import { Node } from '../models/node.model';
import { Call } from '../models/call.model';
import { Expr } from '../models/expr.model';
import { Switch } from '../models/switch.model';
import { Value } from '../models/value.model';
import { Link, LinkJson } from '../models/link.model';
import { Pin, PinType, PinTag } from '../models/pin.model';
import { PinList, PinListEvents } from '../models/pin-list.model';
import { Signature } from '../models/signature.model';
import { SubGraph, SubGraphJson, updateSubgraphTags } from '../models/subgraph.model';


export enum EditorModelEvents {
  pathChange, methodChange, accessChange,
  addNode, removeNode,
  addLink, removeLink,
  save,
}

const _defaultSignature : Signature = {
    path: '/some-path/',
    method: 'GET',
    public: false,
    inputs: [],
    outputs: [],
    controlOutputs: [],
    configs: [],
};

@Injectable()
export class EditorModelService extends Subscribable {
  private _signature: Signature = Object.assign({}, _defaultSignature);

  private _id : string = null;

  private _nodes: Array<Node> = [];
  private _links: Array<Link> = [];

  private _ins: PinList;
  private _outs: PinList;
  private _confs: PinList;
  private _ctrls: PinList;

  private _building = false;

  constructor() {
    super();
    this._ins = new PinList(() => new Pin(PinType.output, PinTag.input));
    this._confs = new PinList(() => new Pin(PinType.output, PinTag.config));
    this._outs = new PinList(() => new Pin(PinType.input, PinTag.output));
    this._ctrls = new PinList(() => new Pin(PinType.input, PinTag.control));

    this._ins.subscribe(PinListEvents.change, () => {
      if (!this._building)
        this._signature.inputs = this._ins.items.map(i => i.label);
    });

    this._confs.subscribe(PinListEvents.change, () => {
      if (!this._building)
        this._signature.configs = this._confs.items.map(i => i.label);
    });

    this._outs.subscribe(PinListEvents.change, () => {
      if (!this._building)
        this._signature.outputs = this._outs.items.map(i => i.label);
    });

    this._ctrls.subscribe(PinListEvents.change, () => {
      if (!this._building)
        this._signature.controlOutputs = this._ctrls.items.map(i => i.label);
    });

    this._buildPins();
  }

  public get id() : string { return this._id; }
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

  public set id(id : string) {
    this._id = id;
    this.publish(EditorModelEvents.save);
  }

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

  public createNode(nodeClass, position) : Node {
    let _builder : (tag:string, left:number, top:number) => Node;

    if (nodeClass == Call) _builder = Call.emptyCall;
    if (nodeClass == Expr) _builder = Expr.emptyExpr;
    if (nodeClass == Value) _builder = Value.emptyValue;
    if (nodeClass == Switch) _builder = Switch.emptySwitch;

    let _tag = this.nodeTag(nodeClass);
    return _builder(_tag, position.left, position.top);
  }

  public nodeTag(nodeClass, extras?: string[]): string {
    let _prefix: string;

    if (nodeClass == Call) _prefix = 'c';
    if (nodeClass == Expr) _prefix = 'e';
    if (nodeClass == Value) _prefix = 'v';
    if (nodeClass == Switch) _prefix = 's';

    let _index = 0;
    let _tag : string;
    let _taken = this._nodes.map(n => n.tag);
    if (extras) _taken = _taken.concat(extras);

    while(true) {
      _tag = `${_prefix}${_index}`;
      if (!_taken.includes(_tag))
        break;
      _index++;
    }

    return _tag;
  }

  public addNode(node: Node): EditorModelService {
    this._nodes.push(node);
    this.publish(EditorModelEvents.addNode, node);
    return this;
  }

  public removeNode(node: Node): EditorModelService {
    this.removeNodeLinks(node);
    this.links.forEach(l => {
      if (l.to == node)
        this.removeLink(l);
    });

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

  public removeNodeLinks(node: Node): EditorModelService {
    []
      .concat(node.in.items)
      .concat(node.out.items)
      .concat(node.control.items)
      .map(item => item.pin)
      .forEach(pin => this.removePinLinks(pin));
    return this;
  }

  public removePinLinks(pin: Pin): EditorModelService {
    this.links.forEach(l => {
      if (l.from == pin || l.to == pin)
        this.removeLink(l);
    });

    return this;
  }

  public addSubGraph(subGraph: SubGraph): EditorModelService {
    for (let node of subGraph.nodes) this.addNode(node);
    for (let link of subGraph.links) this.addLink(link);

    return this;
  }

  public addSubGraphFromJson(json: SubGraphJson, registry): SubGraph {
    let tagMap: {[old:string]: string} = {};

    for (let node of json.nodes) {
      let nodeClass = this.nodeClassFromJson(node);
      let tag = this.nodeTag(nodeClass, Object.values(tagMap));

      tagMap[node.tag] = tag;
    }

    updateSubgraphTags(json, tagMap);

    let subGraph: SubGraph = {
      nodes: [],
      links: [],
    }

    for (let node of json.nodes) subGraph.nodes.push(this.addNodeFromJson(node, registry));
    for (let link of json.links) subGraph.links.push(this.addLinkFromJson(link));

    return subGraph;
  }

  private _buildPins() {
    this._building = true;

    this.in.clear();
    this.config.clear();
    this.out.clear();
    this.control.clear();

    for (let _in of this.signature.inputs) this.in.add(_in);
    for (let _conf of this.signature.configs) this.config.add(_conf);
    for (let _out of this.signature.outputs) this.out.add(_out);
    for (let _ctrl of this.signature.controlOutputs) this.control.add(_ctrl);

    this._building = false;
  }

  public get json() {
    return {
      path : this.path,
      method : this.method,
      public : this.public,
      in : this.signature.inputs,
      out : this.signature.outputs,
      configs : this.signature.configs,
      control : this.signature.controlOutputs,
      nodes : this._nodes.map(node => node.json),
      links : this._links.map(link => link.json),
    };
  }

  public reset() : EditorModelService {
    this._id = null;
    this._signature = Object.assign({}, _defaultSignature);
    this._ins.clear();
    this._outs.clear();
    this._confs.clear();
    this._ctrls.clear();
    this._nodes = [];
    this._links = [];
    return this;
  }

  public load(id, json, registry) : EditorModelService {
    this.reset();

    this._id = id;

    this._signature.path = json.path;
    this._signature.method = json.method;
    this._signature.public = json.public;
    this._signature.inputs = json.in;
    this._signature.outputs = json.out;
    this._signature.configs = json.configs;
    this._signature.controlOutputs = json.control;

    this._buildPins();

    this._nodes = [];
    this._links = [];

    for (let _node of json.nodes)
      this.addNodeFromJson(_node, registry);

    for (let _link of json.links)
      this.addLinkFromJson(_link);

    return this;
  }

  public nodeClassFromJson(json) {
    if (json.expr) {
      if (json.in) return Expr;
      else return Value;
    }
    else if (json.cases) return Switch;
    else if (json.path) return Call;
  }

  public addNodeFromJson(json, registry) : Node {
    let nodeClass = this.nodeClassFromJson(json);

    if (nodeClass == Expr) {
      let e = Expr.fromJson(json);
      this.addNode(e);
      return e;
    }
    else if (nodeClass == Value) {
      let v = Value.fromJson(json);
      this.addNode(v);
      return v;
    }
    else if (nodeClass == Switch) {
      let s = Switch.fromJson(json);
      this.addNode(s);
      return s;
    }
    else if (nodeClass == Call) {
      let c = Call.fromJson(json);
      if (registry.isRegistered(c.path))
        c.signature = registry.signature(c.path);
      this.addNode(c);
      return c;
    }
  }

  public addLinkFromJson(json: LinkJson) : Link {
    let _from = this._findPin(json[0]) as Pin;
    let _to = this._findPin(json[1]);
    if (_from && _to) {
      let l = new Link(_from, _to);
      if (_to instanceof Pin)
        _to.activate();

      this.addLink(l);
      return l;
    }
    else {
      console.log('NOT FOUND');
      console.log(json);
    }
  }

  private _findPin(json) : Node | Pin {
    if (typeof(json) == 'string') {
      return this._nodes.filter(n => n.tag == json)[0];
    }
    else {
      let _v = Object.entries(json)[0];
      if (_v[0] == 'in') {
        return this.in.get(_v[1]);
      }
      else if (_v[0] == 'config') {
        return this.config.get(_v[1]);
      }
      else if (_v[0] == 'control') {
        return this.control.get(_v[1]);
      }
      else if (_v[0] == 'out') {
        let _p = this.out.get(_v[1]);
        if (_p) return _p;
        else return this.control.get(_v[1]);
      }
      else {
        let _n = this._nodes.filter(n => n.tag == _v[0])[0];

        if (_v[1] == 'target') {
          return _n.in.get('target');
        }
        else if (_v[1] == 'result') {
          return _n.out.get('result');
        }
        else {
          let _vv = Object.entries(_v[1])[0];
          if (_vv[0] == 'in') {
            return _n.in.get(_vv[1]) || _n.optin.get(_vv[1]);
          }
          else if (_vv[0] == 'case') {
            return (_n as Switch).cases.get(_vv[1]);
          }
          else if (_vv[0] == 'control') {
            return _n.control.get(_vv[1]);
          }
          else if (_vv[0] == 'out') {
            return _n.out.get(_vv[1]);
          }
        }
      }
    }

    console.log('ERRRR');
    console.log(json);
  }
}
