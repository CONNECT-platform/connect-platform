import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Pin } from '../../../models/pin.model';


@Component({
  selector: 'editor-expr',
  templateUrl: './expr.component.html',
  styleUrls: ['./expr.component.css']
})
export class ExprComponent implements OnInit {
  @Input() code: string = '';
  @Input() pin: Pin;
  @Output() codeChange: EventEmitter<string> = new EventEmitter<string>();

  options: any = {
    showGutter: false,
    maxLines: Infinity,
    tabSize: 2,
  }

  constructor() { }

  ngOnInit() {
  }

  get _code() { return this.code; }
  set _code(code: string) {
    this.code = code;
    this.codeChange.emit(code);
  }
}
