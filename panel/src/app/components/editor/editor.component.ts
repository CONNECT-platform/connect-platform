import { Component, OnInit, OnDestroy } from '@angular/core';
import { Link } from '../../models/link.model';
import { Expr } from '../../models/expr.model';
import { Value } from '../../models/value.model';
import { Switch } from '../../models/switch.model';
import { Call } from '../../models/call.model';
import { Box } from '../../models/box.model';
import { EditorService, EditorEvents } from '../../services/editor.service';
import { EditorModelService } from '../../services/editor-model.service';

enum EditorState {
  initial, adding, selected,
}

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, OnDestroy {

  private states = EditorState;
  private state: EditorState = EditorState.initial;

  private selectHandle;
  private deselectHandle;

  constructor(
    private model : EditorModelService,
    private editor: EditorService,
  ) { }

  ngOnInit() {
    this.subscribe();

    let e1 = Value.emptyValue(240, 128);
    let e2 = Expr.emptyExpr(384, 256);
    let e3 = Value.emptyValue(212, 500);
    let s1 = Switch.emptySwitch(700, 128);
    let c1 = Call.emptyCall(620, 480);

    e1.code = '"Hellow World!"\n.length';
    e2.code = 'first*2 + second';
    e3.code = '3.1415926';

    c1.signature = {
      path: '/some/path/',
      inputs: ['what', 'when'],
      outputs: ['this', 'that'],
      controlOutputs: ['error'],
    };

    s1.cases.add('true').add('false');

    e2.in.add('first').add('second');

    let lp = new Link(this.model.in.get('user_id'), e2.in.get('second'));
    let l = new Link(e1.out.get('result'), e2.in.get('first'));
    let l2 = new Link(this.model.in.get('article_id'), c1.in.get('when'));
    let l3 = new Link(e2.out.get('result'), s1.in.get('target'));
    let l4 = new Link(s1.control.get('true'), c1);
    let l5 = new Link(e3.out.get('result'), c1.in.get('what'));

    this.model.addNode(e1)
              .addNode(e2)
              .addNode(e3)
              .addNode(s1)
              .addNode(c1)
              .addLink(l2)
              .addLink(lp)
              .addLink(l)
              .addLink(l4)
              .addLink(l3)
              .addLink(l5);
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  mainAction() {
    if (this.state == EditorState.initial) this.state = EditorState.adding;
    else if (this.state == EditorState.adding) this.state = EditorState.initial;
  }

  private subscribe() {
    this.selectHandle = (target) => {
        this.state = EditorState.selected;
    };

    this.deselectHandle = () => {
      if (this.state == EditorState.selected)
        this.state = EditorState.initial;
    }

    this.editor.subscribe(EditorEvents.select, this.selectHandle);
    this.editor.subscribe(EditorEvents.deselect, this.deselectHandle);
  }

  private unsubscribe() {
    this.editor.unsubscribe(EditorEvents.select, this.selectHandle);
    this.editor.unsubscribe(EditorEvents.deselect, this.deselectHandle);
  }

  newInput() {
    this.model.in.add('');
  }

  newConfig() {
    this.model.config.add('');
  }
}
