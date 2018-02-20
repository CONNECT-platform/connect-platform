import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { PinComponent } from '../../pin/pin.component';
import { EditorService, EditorEvents } from '../../../services/editor.service';
import { Box } from '../../../models/box.model';


@Component({
  selector: 'editor-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @ViewChildren(PinComponent) pins;
  @Input() private box: Box;

  private code: string = `console.log('hellow!');`;
  private picked: boolean = false;

  constructor(private editorService: EditorService) {
  }

  ngOnInit() {
  }

  public pick(event) {
    this.picked = true;
    event.pickedObject = this.box;
    this.editorService.pickEvent(event);
  }

  public unpick() {
    if (this.picked)
      this.editorService.unpickEvent();
  }
}
