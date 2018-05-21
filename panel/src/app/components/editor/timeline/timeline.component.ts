import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import { EditorService } from '../../../services/editor.service';
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
    private editor: EditorService,
  ) { }

  ngOnInit() {
  }

  get events() {
    if (!this.tester.recording) return [];
    if (this.editor.selectTarget && this.editor.selectTarget.relevantEvent) {
      return this.tester.recording.filter(event => this.editor.selectTarget.relevantEvent(event));
    }
    else return this.tester.recording;
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

  @HostListener('document:keyup', ['$event'])
  keyup(event) {
    if (event.keyCode == 32 && this.tester.active) this.tester.togglePlayback();
  }

  @HostListener('document:keydown', ['$event'])
  keydown(event) {
    if (event.keyCode == 37 && this.tester.active) {
      if (event.shiftKey) this.tester.backward(10);
      else this.tester.backward();
    }
    if (event.keyCode == 39 && this.tester.active) {
      if (event.shiftKey) this.tester.forward(10);
      else this.tester.forward();
    }
  }
}
