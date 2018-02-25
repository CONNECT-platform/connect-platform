import { Injectable } from '@angular/core';
import { Signature } from '../models/signature.model';


@Injectable()
export class RegistryService {
  private _registryCache = {
    '/test1/' : {
      inputs: ['in1', 'in2'],
      outputs: ['out'],
    },

    '/test2/': {
      inputs: ['a'],
      outputs: ['something', 'or_not'],
      controlOutputs: ['error'],
    },
  };

  constructor() {}

  public isRegistered(path): boolean {
    return path in this._registryCache;
  }

  public signature(path): Signature {
    return this._registryCache[path];
  }

  public get allPaths() {
    return Object.keys(this._registryCache);
  }
}
