import { Component, OnInit } from '@angular/core';
import { Link } from '../../models/link.model';
import { Expr } from '../../models/expr.model';
import { Value } from '../../models/value.model';
import { Switch } from '../../models/switch.model';
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
    let s1 = Switch.emptySwitch(480, 128);

    e1.code = '"Hellow World!"\n.length';
    e2.code = 'first*2 + second';
    e3.code = '3.1415926';

    s1.addCase('true').addCase('false');

    e2.addIn('first').addIn('second');

    let l = new Link(e1.getOut('result').pin, e2.getIn('first').pin);
    let l2 = new Link(e3.getOut('result').pin, e2.getIn('second').pin);
    let l3 = new Link(e2.getOut('result').pin, s1.getIn('target').pin);
    let l4 = new Link(s1.getControl('true').pin, e3);

    this.model.addNode(e1)
              .addNode(e2)
              .addNode(e3)
              .addNode(s1)
              .addLink(l2)
              .addLink(l)
              .addLink(l4)
              .addLink(l3);
  }
}
