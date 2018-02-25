import { Node } from './node.model';
import { Box } from './box.model';
import { Signature } from './signature.model';


export enum CallEvents {
  signatureChange,
}

export class Call extends Node {
  private _signature: Signature;

  public get signature() { return this._signature; }
  public set signature(_signature: Signature) {
    this.publish(CallEvents.signatureChange, _signature);
    this._signature = _signature;
    this._adoptSignature();
  }

  private _adoptSignature() {
    super.reset();
    if (this.signature) {
      this.signature.inputs.forEach(input => this.addIn(input));
      this.signature.outputs.forEach(output => this.addOut(output));
      if (this.signature.controlOutputs)
        this.signature.controlOutputs.forEach(control => this.addControl(control));
    }
  }

  private static _count = 0;

  public static emptyCall(left: number, top: number): Call {
    Call._count++;
    return new Call(`c${Call._count}`, new Box(left, top, 192, 32));
  }
}
