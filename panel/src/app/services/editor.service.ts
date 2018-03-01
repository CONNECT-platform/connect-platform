import { Injectable } from '@angular/core';
import { Subscribable } from '../util/subscribable';


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

  constructor() {
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
    this.deselect();

    if (event.pickedObject) {
      this.picked = {
        target: event.pickedObject,
      };

      if (event.pickedObject.box) {
        this.picked.anchor = {
          left: event.clientX - event.pickedObject.box.left + this.paneScroll,
          top: event.clientY - event.pickedObject.box.top,
        };
      }

      this.pickedTime = Date.now();
      this.publish(EditorEvents.pick, this.picked);
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

  public unpickEvent() {
    if (this.picked) {
      if (Date.now() - this.pickedTime < 10) {
        this.select(this.picked.target);
      }

      this.publish(EditorEvents.unpick, this.picked);
      this.picked = null;
    }
  }

  public isPicked(obj) {
    return this.picked && obj == this.picked.target;
  }

  public isSelected(obj) {
    return this.selected && obj == this.selected;
  }
}
