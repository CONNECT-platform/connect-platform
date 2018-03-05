import { Subscribable } from '../util/subscribable';
import { Pin, PinType } from './pin.model';


export enum PinListEvents {
  add, remove, clear, change,
}

export enum PinListItemEvents {
  change, touch, clear,
}

export class PinListItem extends Subscribable {
  private _touched : boolean = false;

  constructor(private _label : string, private _pin : Pin) {
    super();
    if (this._label != '') this._touched = true;
  }

  public get label(): string { return this._label; }
  public get pin(): Pin { return this._pin; }

  public get touched(): boolean { return this._touched; }
  public get cleared(): boolean { return this.touched && this.label == ''; }

  public set label(_label: string) {
    this._label = _label;

    if (_label != '') {
      this._touched = true;
      this.publish(PinListItemEvents.touch);
    }

    if (_label == '' && this._touched) {
      this.publish(PinListItemEvents.clear);
    }

    this.publish(PinListItemEvents.change, _label);
  }
}

export class PinList extends Subscribable {
  private _core : Array<PinListItem> = [];
  private _publishChange: any;

  constructor(private pinFactory : () => Pin) {
    super();

    this._publishChange = () => this.publish(PinListEvents.change);
  }

  public get items() : Array<PinListItem> {
    return this._core;
  }

  public add(label : string) : PinList {
    let _new = new PinListItem(label, this.pinFactory());

    this._core.push(_new);

    _new.subscribe(PinListItemEvents.change, this._publishChange);

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

  public remove(item : PinListItem) : PinList {
    item.unsubscribe(PinListItemEvents.change, this._publishChange);

    this._core = this._core.filter(i => i != item);
    this.publish(PinListEvents.remove, item);
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
