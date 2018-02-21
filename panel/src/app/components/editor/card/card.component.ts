import { Component, OnInit, Input,
          ViewChild, ElementRef, OnChanges,
          AfterViewInit } from '@angular/core';
import { EditorService, EditorEvents } from '../../../services/editor.service';
import { Node } from '../../../models/node.model';
import { Expr } from '../../../models/expr.model';


@Component({
  selector: 'editor-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() private node: Node;
  @ViewChild('inputs') private inputs: ElementRef;

  constructor(private editorService: EditorService) {
  }

  ngOnInit() {
    this.node.component = this;
  }

  ngOnChanges() {
    if (this.inputs) setTimeout(() => this._setHeight());
  }

  ngAfterViewInit() {
    setTimeout(() => this._setHeight());
  }

  private _setHeight() {
    this.node.box.height = this.inputs.nativeElement.offsetHeight + 32;
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

  public get isExpression() { return this.node instanceof Expr; }
}
