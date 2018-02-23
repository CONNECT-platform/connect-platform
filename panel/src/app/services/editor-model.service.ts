import { Injectable } from '@angular/core';
import { Subscribable } from '../util/subscribable';
import { Node } from '../models/node.model';
import { Link } from '../models/link.model';


export enum EditorModelEvents {
  addNode, removeNode,
  addLink, removeLink,
}

@Injectable()
export class EditorModelService extends Subscribable {
  private _nodes: Array<Node> = [];
  private _links: Array<Link> = [];

  public get nodes() { return this._nodes; }
  public get links() { return this._links; }

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
