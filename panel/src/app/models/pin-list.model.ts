import { Subscribable } from '../util/subscribable';
import { Pin, PinType } from './pin.model';


export enum PinListEvents {
  add, remove, clear, change,
}

export class PinList extends Subscribable {
  private _core : Array<{label : string, pin : Pin}> = [];

  constructor(private pinFactory : () => Pin) {
    super();
  }

  public get items() : Array<{label : string, pin: Pin}> {
    return this._core;
  }

  public add(label : string) : PinList {
    let _new = {
      label : label,
      pin : this.pinFactory()
    };

    this._core.push(_new);
    this.publish(PinListEvents.add, _new);
    this.publish(PinListEvents.change);
    return this;
  }

  public all(label : string) : Array<Pin> {
    return this._core
                .filter(i => i.label == label)
                .map(i => i.pin);
  }

  public get(label : string) : Pin {
    let _all = this.all(label);
    if (_all.length > 0)
      return _all[0];

    return null;
  }

  public remove(label : string) : PinList {
    this._core = this._core.filter(i => i.label != label);
    this.publish(PinListEvents.remove, label);
    this.publish(PinListEvents.change);
    return this;
  }

  public clear() : PinList {
    this._core = [];
    this.publish(PinListEvents.clear);
    this.publish(PinListEvents.change);
    return this;
  }
}
