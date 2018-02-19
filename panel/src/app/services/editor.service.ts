import { Injectable } from '@angular/core';
import { Subscribable } from '../base/subscribable';


export enum EditorEvents {
  mousemove,
}

@Injectable()
export class EditorService extends Subscribable {
  private mouseX : number;
  private mouseY : number;
  private paneScroll : number = 0;

  constructor() {
    super();
  }

  public mouseMoveEvent(event: any) {
    this.mouseX = event.clientX + this.paneScroll;
    this.mouseY = event.clientY;
    this.publish(EditorEvents.mousemove, {x : this.mouseX, y: this.mouseY});
  }

  public paneScrollEvent(event: any) {
    this.paneScroll = event.srcElement.scrollLeft;
  }
}
