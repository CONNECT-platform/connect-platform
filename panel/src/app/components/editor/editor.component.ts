import { Component, OnInit } from '@angular/core';
import { Link } from '../../models/link.model';
import { Expr } from '../../models/expr.model';
import { Value } from '../../models/value.model';
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
    let e1 = Value.emptyValue(240, 128);
    let e2 = Expr.emptyExpr(384, 256);
    let e3 = Value.emptyValue(212, 500);
    e1.code = '"Hellow World!"\n.length';
    e2.code = 'first*2 + second';
    e3.code = '3.1415926';

    e2.addIn('first').addIn('second');

    let l = new Link(e1.out['result'], e2.in['first']);
    let l2 = new Link(e3.out['result'], e2.in['second']);

    this.model.addNode(e1)
              .addNode(e2)
              .addNode(e3)
              .addLink(l2)
              .addLink(l);
  }
}
