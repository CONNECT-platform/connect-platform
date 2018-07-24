import { Component, OnInit, Input, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { elementBox } from '../../../util/elem-box';


@Component({
  selector: 'overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent implements OnInit {

  @Input() public icon: string;
  @Input() public expansive: boolean = false;

  @ViewChild('inner') inner: ElementRef;
  private _active : boolean = false;
  private _onActivate : EventEmitter<void> = new EventEmitter<void>();
  private _onClose : EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  @Input() public get active() {
    return this._active;
  }

  public set active(_active: boolean) {
    if (_active) this.activate();
    else this.close();
  }

  public activate() {
    if (!this._active) {
      this._active = true;
      this._onActivate.emit();
    }

    return this;
  }

  public close() {
    if (this._active) {
      this._active = false;
      this._onClose.emit();
    }

    return this;
  }

  public checkClose(event) {
    let box = elementBox(this.inner.nativeElement);

    if (event.clientX < box.left || event.clientY > box.right ||
      event.clientY < box.top || event.clientY > box.bottom)
      this.close();
  }

  public get onActivate() { return this._onActivate; }
  public get onClose() { return this._onClose; }
}
