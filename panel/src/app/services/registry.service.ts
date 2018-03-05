import { Injectable } from '@angular/core';

import { Signature } from '../models/signature.model';
import { EditorModelService } from './editor-model.service';


@Injectable()
export class RegistryService {
  private _registryCache = {
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

  constructor(private model: EditorModelService) {}

  public isRegistered(path): boolean {
    return path in this._registry;
  }

  public signature(path): Signature {
    return this._registry[path];
  }

  public get allPaths() {
    return Object.keys(this._registry);
  }

  private get _registry() {
    let _dict = {};
    _dict[this.model.signature.path] = this.model.signature;
    return Object.assign(_dict, this._registryCache);
  }
}
