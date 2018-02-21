import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Pin } from '../../../models/pin.model';
import { elementBox } from '../../../base/elem-box';


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
    let b = elementBox(this.el.nativeElement);
    return {
      left: (b.left + b.right)/2,
      top: (b.top + b.bottom)/2,
    }
  }
}
