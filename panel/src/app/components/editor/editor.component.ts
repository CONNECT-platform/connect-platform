import { Component, OnInit } from '@angular/core';
import { Link } from '../../models/link.model';
import { Expr } from '../../models/expr.model';
import { Box } from '../../models/box.model';
import { EditorModelService } from '../../services/editor-model.service';


@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  constructor(private model : EditorModelService) { }

  ngOnInit() {
    let e1 = Expr.emptyExpr(240, 128);
    let e2 = Expr.emptyExpr(384, 256);
    let e3 = Expr.emptyExpr(212, 500);
    e1.code = '"Hellow World!".length';
    e2.code = 'a * 2 + b';
    e3.code = '3.1415926';

    e2.addIn('a').addIn('b');

    let l = new Link(e1.out['result'], e2.in['a']);
    let l2 = new Link(e3.out['result'], e2.in['b']);

    this.model.addNode(e1)
              .addNode(e2)
              .addNode(e3)
              .addLink(l2)
              .addLink(l);
  }
}
