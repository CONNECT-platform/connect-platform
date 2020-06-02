import { Node, NodeJson } from './node.model';
import { Pin } from './pin.model';
import { PinListItem } from './pin-list.model';
import { Box } from './box.model';
import { Signature } from './signature.model';


export enum CallEvents {
  signatureChange, pathKeyChange,
  pathChange, keyChange
}

export interface CallJson extends NodeJson {
  path: string;
}

export interface PathKeyPairType {  
  path: string;
  key: string;
}

export class Call extends Node {
  private _signature: Signature;
  private _pathKeyPair: PathKeyPairType = {
    path: '',
    key: ''
  };

  public get signature() { return this._signature; }
  public set signature(_signature: Signature) {
    this.publish(CallEvents.signatureChange, _signature);
    this._signature = _signature;
    this._adoptSignature();
  }

  public get path() { return this._pathKeyPair.path; }
  public set path(path : string) {
    this._pathKeyPair.path = path;
    this.publish(CallEvents.pathChange, path);
  }
  
  public get key() { return this._pathKeyPair.key; }
  public set key(key : string) {
    this._pathKeyPair.key = key;
    this.publish(CallEvents.keyChange, key);
  }

  public get pathKeyPair() { return this._pathKeyPair; }
  public set pathKeyPair(pathKeyPair : PathKeyPairType) {
    this._pathKeyPair = pathKeyPair;
    this.publish(CallEvents.pathKeyChange, pathKeyPair);
  }

  public adopt(signature: Signature, removeCallback?: (pin:Pin) => void) {
    if (!this.signature)
      this.signature = signature;
    else {
      this.publish(CallEvents.signatureChange, signature);
      this._signature = signature;
      this.in.adopt(signature.inputs, removeCallback);
      this.optin.adopt(signature.optionalInputs, removeCallback);
      this.out.adopt(signature.outputs, removeCallback);
      this.control.adopt(signature.controlOutputs, removeCallback);
    }
  }

  protected toJson(): CallJson {
    return Object.assign(super.toJson(), {
      path : this.path,
    });
  }

  private _adoptSignature() {
    super.reset();
    if (this.signature) {
      this.signature.inputs.forEach(input => this.in.add(input));
      if (this.signature.optionalInputs)
        this.signature.optionalInputs.forEach(oi => this.optin.add(oi));
      this.signature.outputs.forEach(output => this.out.add(output));
      if (this.signature.controlOutputs)
        this.signature.controlOutputs.forEach(control => this.control.add(control));
    }
  }

  public static emptyCall(tag: string, left: number, top: number): Call {
    let call = new Call(tag, new Box(left || 256, top || 256, 242, 32));
    call.path = '/path-to-node/';
    call.signature = {
      path: '/path-to-node/',
      inputs: [],
      outputs: [],
      controlOutputs: []
    };
    return call;
  }

  public static fromJson(json: CallJson) {
    let call = new Call(json.tag, Box.fromJson(json.box));
    call.path = json.path;

    return call;
  }

  public is(type: string): boolean {
    if (type === 'call') return true;
    else return super.is(type);
  }
}
