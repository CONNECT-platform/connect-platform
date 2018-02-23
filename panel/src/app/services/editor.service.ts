import { Injectable } from '@angular/core';
import { Subscribable } from '../util/subscribable';
import { Box } from '../models/box.model';


export enum EditorEvents {
  mousemove,
  paneScroll,
  pick, unpick,
}

@Injectable()
export class EditorService extends Subscribable {
  private mouseX : number;
  private mouseY : number;
  private paneScroll : number = 0;
  private picked: any = null;

  constructor() {
    super();
  }

  get paneScrollAmount() { return this.paneScroll; }

  public mouseMoveEvent(event: any) {
    this.mouseX = event.clientX + this.paneScroll;
    this.mouseY = event.clientY;

    if (this.picked) {
      if (this.picked.target instanceof Box) {
        this.picked.target.pick(this.picked.anchor).move({
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
    this.picked = {
      target: event.pickedObject,
      anchor: {
        left: event.clientX - event.pickedObject.left + this.paneScroll,
        top: event.clientY - event.pickedObject.top,
      }
    }
    this.publish(EditorEvents.pick, this.picked);
  }

  public unpickEvent() {
    this.publish(EditorEvents.unpick, this.picked);
    this.picked = null;
  }

  public isPicked(obj) {
    return this.picked && obj == this.picked.target;
  }
}
