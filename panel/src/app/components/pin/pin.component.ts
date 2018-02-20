import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.css']
})
export class PinComponent implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit() {
  }

  public get offset(): {left: number, top: number} {
    return {
      left: this.el.nativeElement.offsetLeft,
      top: this.el.nativeElement.offsetTop,
    };
  }
}
