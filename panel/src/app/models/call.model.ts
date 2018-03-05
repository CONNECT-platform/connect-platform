import { Node } from './node.model';
import { Box } from './box.model';
import { Signature } from './signature.model';


export enum CallEvents {
  signatureChange, pathChange,
}

export class Call extends Node {
  private _signature: Signature;
  private _path: string;

  public get signature() { return this._signature; }
  public set signature(_signature: Signature) {
    this.publish(CallEvents.signatureChange, _signature);
    this._signature = _signature;
    this._adoptSignature();
  }

  public get path() { return this._path; }
  public set path(path : string) {
    if (path != this.path) {
      this._path = path;
      this.publish(CallEvents.pathChange, path);
    }
  }

  private _adoptSignature() {
    super.reset();
    if (this.signature) {
      this.signature.inputs.forEach(input => this.in.add(input));
      this.signature.outputs.forEach(output => this.out.add(output));
      if (this.signature.controlOutputs)
        this.signature.controlOutputs.forEach(control => this.control.add(control));
    }
  }

  private static _count = 0;

  public static emptyCall(left: number, top: number): Call {
    Call._count++;
    let call = new Call(`c${Call._count}`, new Box(left, top, 196, 32));
    call.path = '/path-to-node/';
    call.signature = {
      path: '/path-to-node/',
      inputs: [],
      outputs: [],
      controlOutputs: []
    };
    return call;
  }
}
