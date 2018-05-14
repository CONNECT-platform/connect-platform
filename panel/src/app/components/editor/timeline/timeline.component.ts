import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { TesterService } from '../../../services/tester.service';


@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  public seek: boolean = false;
  public hoverTime: number = 0;
  public hoverTimeLeft: number = 0;

  @ViewChild('holder') holder : ElementRef;

  constructor(
    private tester : TesterService,
  ) { }

  ngOnInit() {
  }

  get filled() {
    if (this.tester.duration > 0) {
      return this.tester.playbackPosition / this.tester.duration;
    }
    else return 0;
  }

  updateHoverTime(event) {
    this.hoverTime = (event.clientX - this.holder.nativeElement.offsetLeft) /
      this.holder.nativeElement.offsetWidth * this.tester.duration;

    this.hoverTimeLeft = event.clientX - this.holder.nativeElement.offsetLeft;

    if (this.seek)
      this.tester.playbackPosition = this.hoverTime;
  }
}
