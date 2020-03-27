import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Pin } from '../../../models/pin.model';

import { EditorService } from '../../../services/editor.service';


@Component({
  selector: 'editor-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit {
  @ViewChild('ace', { static: true }) ace;

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

  constructor(private editor: EditorService) { }

  ngOnInit() {
    if (!this.code)
      this.ace.getEditor().focus();
  }

  get _code() { return this.code; }
  set _code(code: string) {
    this.code = code;
    this.codeChange.emit(code);
  }

  focused(event) {
    this.editor.deselect();
    event.stopPropagation();
  }
}
