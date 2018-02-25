import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { EditorService, EditorEvents } from '../../../services/editor.service';
import { Node, NodeEvents } from '../../../models/node.model';
import { Value } from '../../../models/value.model';
import { Expr, ExprEvents } from '../../../models/expr.model';
import { Switch, SwitchEvents } from '../../../models/switch.model';
import { Box } from '../../../models/box.model';
import { Call, CallEvents } from '../../../models/call.model';
import { decomposeCode, recomposeCode } from '../../../util/decompose-code';


enum CardType { value, expr, switch, call, }

@Component({
  selector: 'editor-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() private node: Node;
  @ViewChild('inner') private inner: ElementRef;
  @ViewChild('inputs') private inputs: ElementRef;

  private types = CardType;
  private focusedInputVal: string;
  private decomposedFIVal: any;

  private _newBorn = true;

  constructor(private editorService: EditorService) {
  }

  ngOnInit() {
    this.node.component = this;
    setInterval(() => this._setHeight(), 100);
    setTimeout(() => {this._newBorn = false}, 500);
  }

  private _setHeight() {
    if (this.type == CardType.value) this.node.box.height = 0;
    else if (this.type == CardType.expr)
      this.node.box.height = this.inner.nativeElement.offsetHeight - 24;
    else
      this.node.box.height = this.inner.nativeElement.offsetHeight;
  }

  public pick(event) {
    event.pickedObject = this.node.box;
    this.editorService.pickEvent(event);
  }

  public unpick() {
    if (this.picked)
      this.editorService.unpickEvent();
  }

  public get picked() {
    return this.editorService.isPicked(this.node.box);
  }

  public get type() {
    if (this.node instanceof Value) return CardType.value;
    if (this.node instanceof Expr) return CardType.expr;
    if (this.node instanceof Switch) return CardType.switch;
    if (this.node instanceof Call) return CardType.call;
  }

  public get box() {
    if (this.inner)
      return Box.fromElement(this.inner.nativeElement);
  }

  public inputFocus(event) {
    this.focusedInputVal = event.target.value;
    if (this.type == CardType.expr) {
      let expr = this.node as Expr;
      this.decomposedFIVal = decomposeCode(expr.code, this.focusedInputVal);
    }
  }

  public inputChange(input, event) {
    let newVal = event.target.value;
    input.label = newVal;

    if (this.type == CardType.expr) {
      let expr = this.node as Expr;
      expr.code = recomposeCode(this.decomposedFIVal, newVal);
    }

    this.focusedInputVal = newVal;
  }
}
