import { Component, OnInit, Input,
          ViewChild, ElementRef, OnChanges,
          AfterViewInit } from '@angular/core';
import { EditorService, EditorEvents } from '../../../services/editor.service';
import { Node } from '../../../models/node.model';
import { Expr, ExprEvents } from '../../../models/expr.model';
import { decomposeCode, recomposeCode } from '../../../base/decompose-code';


enum CardType { expr, }

@Component({
  selector: 'editor-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() private node: Node;
  @ViewChild('inner') private inner: ElementRef;
  @ViewChild('inputs') private inputs: ElementRef;

  private types = CardType;
  private focusedInputVal: string;
  private decomposedFIVal: any;

  constructor(private editorService: EditorService) {
  }

  ngOnInit() {
    this.node.component = this;
    if (this.type == CardType.expr) {
      this.node.subscribe(ExprEvents.codeChange, () => {
        setTimeout(() => this._setHeight());
      });
    }
  }

  ngOnChanges() {
    if (this.inputs) setTimeout(() => this._setHeight());
  }

  ngAfterViewInit() {
    setTimeout(() => this._setHeight());
  }

  private _setHeight() {
    this.node.box.height = this.inner.nativeElement.offsetHeight - 32;
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
    if (this.node instanceof Expr) return CardType.expr;
  }

  public inputFocus(event) {
    this.focusedInputVal = event.target.value;
    if (this.type == CardType.expr) {
      let expr = this.node as Expr;
      this.decomposedFIVal = decomposeCode(expr.code, this.focusedInputVal);
    }
  }

  public inputChange(event) {
    let newVal = event.target.value;
    this.node.renameIn(this.focusedInputVal, newVal);

    if (this.type == CardType.expr) {
      let expr = this.node as Expr;
      expr.code = recomposeCode(this.decomposedFIVal, newVal);
    }

    this.focusedInputVal = newVal;
  }
}
