import { Component, OnInit, Input, EventEmitter } from '@angular/core';


@Component({
  selector: 'overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent implements OnInit {

  @Input() active : boolean = false;
  private _onActivate : EventEmitter<void> = new EventEmitter<void>();
  private _onClose : EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  public activate() {
    this.active = true;
    this._onActivate.emit();
    return this;
  }

  public close() {
    this.active = false;
    this._onClose.emit();
    return this;
  }

  public get onActivate() { return this._onActivate; }
  public get onClose() { return this._onClose; }
}
