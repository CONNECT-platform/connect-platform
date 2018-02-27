import { Injectable } from '@angular/core';
import { Subscribable } from '../util/subscribable';
import { Node } from '../models/node.model';
import { Link } from '../models/link.model';
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

  public get signature(): Signature { return this._signature; }
  public get path(): string { return this._signature.path; }
  public get method(): string { return this._signature.method.toUpperCase(); }
  public get public(): boolean { return this._signature.public; }
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
}
