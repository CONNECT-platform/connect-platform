import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Link } from '../../models/link.model';
import { Expr } from '../../models/expr.model';
import { Value } from '../../models/value.model';
import { Switch } from '../../models/switch.model';
import { Call } from '../../models/call.model';
import { Box } from '../../models/box.model';
import { Node } from '../../models/node.model';
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

  //  this._createMock();
  }

  ngOnDestroy() {
    this.unsubscribe();
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

  mainAction() {
    if (this.state == EditorState.initial) this.state = EditorState.adding;
    else if (this.state == EditorState.adding) this.state = EditorState.initial;
    else if (this.state == EditorState.selected) {
      if (this.editor.selectTarget instanceof Link) {
        this.model.removeLink(this.editor.selectTarget);
        this.editor.deselect();
        this.state = EditorState.initial;
      }
      else if (this.editor.selectTarget instanceof Node) {
        this.model.removeNode(this.editor.selectTarget);
        this.editor.deselect();
        this.state = EditorState.initial;
      }
    }
  }

  newInput() { this.model.in.add(''); }
  newConfig() { this.model.config.add(''); }
  newOutput() { this.model.out.add(''); }
  newControl() { this.model.control.add(''); }

  newNode(node) {
    this.model.addNode(node);
    this.editor.pickEvent({
      node: node
    });

    if (this.state == EditorState.adding)
      this.state = EditorState.initial;
  }

  newValue() { this.newNode(this.model.createNode(Value, this.editor.cursorAbsolute)); }
  newExpr() { this.newNode(this.model.createNode(Expr, this.editor.cursorAbsolute)); }
  newSwitch() { this.newNode(this.model.createNode(Switch, this.editor.cursorAbsolute)); }
  newCall() { this.newNode(this.model.createNode(Call, this.editor.cursorAbsolute)); }

  sanitizeInput(input) {
    console.log(input.touched);
    if (input.cleared) {
      this.model.removePinLinks(input.pin);
      this.model.in.remove(input);
    }
  }

  sanitizeConfig(config) {
    if (config.cleared) {
      this.model.removePinLinks(config.pin);
      this.model.config.remove(config);
    }
  }

  sanitizeOutput(out) {
    if (out.cleared) {
      this.model.removePinLinks(out.pin);
      this.model.out.remove(out);
    }
  }

  sanitizeControl(control) {
    if (control.cleared) {
      this.model.removePinLinks(control.pin);
      this.model.control.remove(control);
    }
  }

  save() {
    console.log(this.model.json);
  }

  @HostListener('document:keyup', ['$event'])
  keypress(event) {
    if (event.keyCode == 27 && this.state == EditorState.adding)
      this.state = EditorState.initial;
  }
}
