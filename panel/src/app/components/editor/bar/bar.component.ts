import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'editor-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {

  @Input() position: string = 'left';

  constructor() { }

  ngOnInit() {
  }

  public get isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }
}
