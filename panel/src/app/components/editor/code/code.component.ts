import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Pin } from '../../../models/pin.model';


@Component({
  selector: 'editor-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit {
  @Input() selected: boolean = false;
  @Input() error: boolean = false;
  @Input() readonly: boolean = false;
  @Input() code: string = '';
  @Input() shadow: boolean = true;
  @Input() pin: Pin;
  @Output() codeChange: EventEmitter<string> = new EventEmitter<string>();

  options: any = {
    showGutter: false,
    maxLines: 12,
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
