import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Pin } from '../../../models/pin.model';
import { Box } from '../../../models/box.model';


@Component({
  selector: 'editor-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.css']
})
export class PinComponent implements OnInit {

  @Input() pin: Pin;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    if (this.pin) setTimeout(() => this.pin.component = this);
  }

  public get pos() {
    return Box.fromElement(this.el.nativeElement).center;
  }
}
