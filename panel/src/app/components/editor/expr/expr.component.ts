import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'editor-expr',
  templateUrl: './expr.component.html',
  styleUrls: ['./expr.component.css']
})
export class ExprComponent implements OnInit {

  code: string = '';
  options: any = {
    showGutter: false,
    maxLines: Infinity,
    tabSize: 2,
  }

  constructor() { }

  ngOnInit() {
  }

}
