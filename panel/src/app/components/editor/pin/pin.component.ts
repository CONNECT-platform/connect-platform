import { Component, OnInit, ElementRef, Input } from '@angular/core';

import { EditorService } from '../../../services/editor.service';
import { Pin, PinType } from '../../../models/pin.model';
import { Box } from '../../../models/box.model';


@Component({
  selector: 'editor-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.css']
})
export class PinComponent implements OnInit {

  cooldown = undefined;
  @Input() pin: Pin;
  @Input() controlStyle: boolean = false;

  constructor(private el: ElementRef, private editor: EditorService) { }

  ngOnInit() {
    if (this.pin) setTimeout(() => this.pin.component = this);
  }

  public get pos() {
    return Box.fromElement(this.el.nativeElement).center;
  }

  get control() {
    return (this.pin && this.pin.type == PinType.control) || this.controlStyle;
  }

  click(event?) {
    if (event && this.pin) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!this.cooldown) {
      if (this.pin)
        this.editor.pickEvent({
          pin: this.pin
        });

      this.cooldown = setTimeout(() => this.cooldown = undefined, 100);
    }
  }
}
