import { Component, OnInit, HostListener } from '@angular/core';

import { HintService } from '../../../services/hint.service';

@Component({
  selector: 'hintman',
  templateUrl: './hintman.component.html',
  styleUrls: ['./hintman.component.css']
})
export class HintmanComponent implements OnInit {

  public mousex: number;
  public mousey: number;

  aceOptions: any = {
    showGutter: false,
    maxLines: Infinity,
    tabSize: 2,
    wrap: true,
  }

  constructor(
    private _hint: HintService
  ) { }

  ngOnInit() {
  }

  @HostListener('document:mousemove', ['$event'])
  mousemove(event) {
    this.mousex = event.clientX;
    this.mousey = event.clientY;
  }

  get hint() {
    return this.hint;
  }
}
