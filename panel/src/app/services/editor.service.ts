import { Injectable } from '@angular/core';

import { Subscribable } from '../util/subscribable';
import { EditorModelService } from './editor-model.service';
import { Link } from '../models/link.model';
import { Pin, PinType } from '../models/pin.model';


export enum EditorEvents {
  mousemove,
  paneScroll,
  pick, unpick,
  select, deselect,
}

@Injectable()
export class EditorService extends Subscribable {
  private mouseX : number;
  private mouseY : number;
  private paneScroll : number = 0;
  private picked: any = null;
  private selected: any = null;

  private pickedTime = null;
  private freeLink: Link = null;

  constructor(private model : EditorModelService) {
    super();
  }

  get paneScrollAmount() { return this.paneScroll; }

  public mouseMoveEvent(event: any) {
    this.mouseX = event.clientX + this.paneScroll;
    this.mouseY = event.clientY;

    if (this.picked) {
      if (this.picked.target.box) {
        this.picked.target.box.pick(this.picked.anchor).move({
          left: this.mouseX,
          top: this.mouseY,
        });
      }
    }

    this.publish(EditorEvents.mousemove, {x : this.mouseX, y: this.mouseY});
  }

  public paneScrollEvent(event: any) {
    this.paneScroll = event.srcElement.scrollLeft;
    this.publish(EditorEvents.paneScroll, this.paneScroll);
  }

  public pickEvent(event: any) {
    if (this.picked) return;

    let updatePickTime = !this.isSelected(event.node);
    this.deselect();

    if (event.node) {
      if (this.freeLink && this.freeLink.compatible(event.node)) {
        this.freeLink.to = event.node;
        this.freeLink = null;
        return;
      }

      this.picked = {
        target: event.node,
      };

      if (event.node.box) {
        if (event.clientX && event.clientY) {
          this.picked.anchor = {
            left: event.clientX - event.node.box.left + this.paneScroll,
            top: event.clientY - event.node.box.top,
          };
        }
        else {
          let center = event.node.box.center;
          this.picked.anchor = {
            left: center.left - event.node.box.left,
            top: center.top - event.node.box.top,
          }
        }
      }

      if (updatePickTime)
        this.pickedTime = Date.now();
      this.publish(EditorEvents.pick, this.picked);
    }

    if (event.pin) {
      if (this.freeLink == null) {
        if (event.pin.type == PinType.output ||
            event.pin.type == PinType.control) {
            this.freeLink = new Link(event.pin, null);
            this.model.addLink(this.freeLink);
        }
      }
      else {
        if (this.freeLink.compatible(event.pin)) {
          this.freeLink.to = event.pin;
          this.freeLink = null;
        }
      }
    }
  }

  public unpickEvent() {
    if (this.picked) {
      if (Date.now() - this.pickedTime < 200) {
        this.select(this.picked.target);
      }

      this.publish(EditorEvents.unpick, this.picked);
      this.picked = null;
    }
  }

  public select(target: any) {
    if (target != this.selected) this.deselect();

    this.selected = target;
    this.publish(EditorEvents.select, this.selected);
  }

  public deselect() {
    if (this.selected) {
      this.publish(EditorEvents.deselect, this.selected);
      this.selected = null;
    }
  }

  public isPicked(obj) {
    return this.picked && obj == this.picked.target;
  }

  public isSelected(obj) {
    return this.selected && obj == this.selected;
  }

  get selectTarget() {
    return this.selected;
  }

  get cursor() {
    return {
      left: this.mouseX,
      top: this.mouseY,
    }
  }

  get cursorAbsolute() {
    return {
      left: this.mouseX - this.paneScroll,
      top: this.mouseY,
    }
  }

  public releaseFreeLink() {
    if (this.freeLink) {
      this.model.removeLink(this.freeLink);
      this.freeLink = null;
    }
  }
}
