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

  constructor(
    private hint: HintService
  ) { }

  ngOnInit() {
  }

  @HostListener('document:mousemove', ['$event'])
  mousemove(event) {
    this.mousex = event.clientX;
    this.mousey = event.clientY;
  }
}
