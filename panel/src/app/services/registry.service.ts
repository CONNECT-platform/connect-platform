import { Injectable } from '@angular/core';

import { Signature, SignatureHints } from '../models/signature.model';
import { BackendService } from './backend.service';
import { EditorModelService } from './editor-model.service';


@Injectable()
export class RegistryService {
  private _registryCache : any = {
    '/test1/' : {
      get: {
        path: '/test1/',
        inputs: ['in1', 'in2'],
        outputs: ['out'],
      }
    },

    '/test2/': {
      post: {
        path: '/test2/',
        inputs: ['a'],
        outputs: ['something', 'or_not'],
        controlOutputs: ['error'],
      }
    },
  };

  private _nodesCache : any = {};

  private _shouldRefetch: boolean = true;
  private _shouldRefetchNodes: boolean = true;

  constructor(
    private backend: BackendService,
    private model: EditorModelService
  ) {
    this._refetch();
    this._refetchNodes();
  }

  public isRegistered(path): boolean {
    return path in this._registry;
  }

  public signature(path, publ = false, method = '', socket = false): Signature {
    console.log('values', Object.values(this._registry[path]), publ);
    const found = Object.values(this._registry[path]).find(
      (el: Signature) =>
        el.public === publ &&
        el.method === method &&
        el.socket === socket
    ) as Signature;

    if(method === '') {  
      method = Object.keys(this._registry[path])[0];
    }

    return found;
  }

  public hints(path): SignatureHints|null {
    const method = Object.keys(this._registry[path])[0];

    return this._registry[path][method].hints;
  }

  public get allPaths() {
    return Object.keys(this._registry);
  }

  public get nodes() {
    this._refetchNodes();
    return this._nodesCache;
  }

  private get _registry() {
    this._refetch();
    let _dict = {};
    if( ! (_dict[this.model.signature.path] instanceof Object) ) _dict[this.model.signature.path] = {};

    _dict[this.model.signature.path][this.model.signature.method] = this.model.signature;
    return Object.assign({}, this._registryCache, _dict);
  }

  private _refetch() {
    if (this._shouldRefetch) {
      this._shouldRefetch = false;
      this.backend.fetchRegistry().subscribe(response => {
        this._registryCache = {};
        Object.entries(response.registry).forEach(entry => {
          Object.entries(response.registry[entry[0]]).forEach(methodEntry => {
            if( ! (this._registryCache[entry[0]] instanceof Object) )
              this._registryCache[entry[0]] = {};
            
            this._registryCache[entry[0]][methodEntry[0]] = Object.assign({
              inputs: [],
              outputs: [],
              controlOutputs: [],
              public: false,
              socket: false,
              method: "GET"
            }, methodEntry[1]['signature']);
          });
        });
        setTimeout(() => this._shouldRefetch = true, 500);
      });
    }
  }

  private _refetchNodes() {
    if (this._shouldRefetchNodes) {
      this._shouldRefetchNodes = false;
      this.backend.nodes.subscribe(response => {
        if (response.nodes) {
          this._nodesCache = response.nodes;
        }
      });
      setTimeout(() => this._shouldRefetchNodes = true, 1000);
    }
  }
}
