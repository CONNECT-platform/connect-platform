import { Subscribable } from '../util/subscribable';
import { Pin, PinType, PinTag } from './pin.model';
import { Node } from './node.model';


export class Link extends Subscribable {
  private _from: Pin;
  private _to: Pin | Node;

  constructor(from: Pin, to: Pin | Node) {
    super();
    this._from = from;
    this._to = to;
  }

  public get from(): Pin { return this._from; }
  public get to(): Pin | Node { return this._to; }

  public set to(pin: Pin | Node) {
    if (this.compatible(pin))
      this._to = pin;
  }

  public relevantEvent(event): boolean {
    if (this.from.node)
      return event.event.tag == 'node' &&
        event.event.cascaded.tag == this.from.node.tag &&
        (event.event.cascaded.cascaded.tag == 'out' ||
        event.event.cascaded.cascaded.tag == 'controlOut') &&
        event.event.cascaded.cascaded.cascaded.tag == this.from.item.label;
    else {
      let tag = this.from.tag as PinTag;

      return ((event.event.tag == 'in' && tag == PinTag.input) ||
              (event.event.tag == 'conf' && tag == PinTag.config))
            && event.event.cascaded.tag == this.from.item.label
            ;
    }
  }

  public compatible(target: Pin | Node): boolean {
    if (this._to != null) return false;

    if (target instanceof Pin) {
      let pin = target as Pin;
      if (pin.node && pin.node == this._from.node) return false;

      if (this._from.type == PinType.output)
        return pin.type == PinType.input && (pin.node != null || pin.tag != PinTag.control);
      if (this._from.type == PinType.control)
        return (pin.type == PinType.input) && pin.node == null && pin.tag == PinTag.control;
    }

    if (target instanceof Node) {
      return this._from.type == PinType.control;
    }

    return false;
  }

  public get json() {
    return [this.from.json,
            (this.to instanceof Node)?
            (this.to.tag):(this.to.json)];
  }
}
