import { Injectable } from '@angular/core';

import { Signature, SignatureHints } from '../models/signature.model';
import { BackendService } from './backend.service';
import { EditorModelService } from './editor-model.service';


@Injectable()
export class RegistryService {
  private _registryCache : any = {
    '/test1/' : {
      path: '/test1/',
      inputs: ['in1', 'in2'],
      outputs: ['out'],
    },

    '/test2/': {
      path: '/test2/',
      inputs: ['a'],
      outputs: ['something', 'or_not'],
      controlOutputs: ['error'],
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

  public signature(path): Signature {
    return this._registry[path];
  }

  public hints(path): SignatureHints|null {
    return this._registry[path].hints;
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
    _dict[this.model.signature.path] = this.model.signature;
    return Object.assign({}, this._registryCache, _dict);
  }

  private _refetch() {
    if (this._shouldRefetch) {
      this._shouldRefetch = false;
      this.backend.fetchRegistry().subscribe(response => {
        this._registryCache = {};
        Object.entries(response.registry).forEach(entry => {
          this._registryCache[entry[0]] = Object.assign({
            inputs: [],
            outputs: [],
            controlOutputs: [],
          }, entry[1].signature);
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
