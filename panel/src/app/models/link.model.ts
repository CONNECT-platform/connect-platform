import { Subscribable } from '../util/subscribable';
import { Pin, PinType, PinTag } from './pin.model';
import { Node, NodeJson } from './node.model';

export type LinkJson = [any, NodeJson | any];

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

  public set from(pin: Pin) {
    if (this.compatible(pin))
      this._from = pin;
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
    if (this._to != null && this._from != null) return false;

    let source = (this._from || this._to) as Pin;

    if (target instanceof Pin) {
      let pin = target as Pin;
      if (pin.node && pin.node == source.node) return false;

      if (source.type == PinType.output)
        return pin.type == PinType.input && (pin.node != null || pin.tag != PinTag.control);
      if (source.type == PinType.control)
        return (pin.type == PinType.input) && pin.node == null && pin.tag == PinTag.control;
      if (source.type == PinType.input && source.tag != PinTag.control)
        return (pin.type == PinType.output);
      if (source.type == PinType.input && source.tag == PinTag.control)
        return (pin.type == PinType.control);
    }

    if (target instanceof Node) {
      return this._from && this._from.type == PinType.control;
    }

    return false;
  }

  public get json(): LinkJson {
    return [this.from.json,
            (this.to instanceof Node)?
            (this.to.tag):(this.to.json)];
  }
}
