import { Component, OnInit, OnDestroy,
        Input, ViewChild, ElementRef, HostListener } from '@angular/core';

import { EditorService, EditorEvents } from '../../../services/editor.service';
import { EditorModelService } from '../../../services/editor-model.service';
import { TesterService } from '../../../services/tester.service';
import { RegistryService } from '../../../services/registry.service';
import { Node, NodeEvents } from '../../../models/node.model';
import { Value } from '../../../models/value.model';
import { Expr, ExprEvents } from '../../../models/expr.model';
import { Switch } from '../../../models/switch.model';
import { Box } from '../../../models/box.model';
import { Call, CallEvents } from '../../../models/call.model';
import { decomposeCode, recomposeCode } from '../../../util/decompose-code';


enum CardType { value, expr, switch, call, }

@Component({
  selector: 'editor-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnDestroy {
  @Input() private node: Node;
  @ViewChild('inner') private inner: ElementRef;
  @ViewChild('inputs') private inputs: ElementRef;

  private types = CardType;
  private focusedInputVal: string;
  private decomposedFIVal: any;
  private _newBorn = true;
  private _suggesting = null;
  private _interval : any;

  private _recordingEvents = undefined;
  private _subs = [];

  constructor(
    private editor: EditorService,
    private model : EditorModelService,
    private tester: TesterService,
    private registry : RegistryService,
    ) {}

  ngOnInit() {
    this.node.component = this;
    this._interval = setInterval(() => this._setHeight(), 200);
    setTimeout(() => {this._newBorn = false}, 500);

    if (this.node instanceof Call) {
      let call = this.node as Call;

      if (this.registry.isRegistered(call.path) && !call.signature) {
        call.signature = this.registry.signature(call.path);
      }

      call.subscribe(CallEvents.pathChange, path => {
        this.model.removeNodeLinks(call);
        if (this.registry.isRegistered(path)) {
          call.signature = this.registry.signature(path);
        }
        else {
          call.signature = {
            path: path,
            inputs: [],
            outputs: [],
            controlOutputs: [],
          };
        }
      });
    }

    this._subs.push(this.tester.onRecorded.subscribe(recording => {
      this._recordingEvents = recording.filter(event =>
        event.event.tag == 'node' &&
        event.event.cascaded.tag == this.node.tag &&
        (event.event.cascaded.cascaded.event == 'activate' ||
        event.event.cascaded.cascaded.tag == 'out' ||
        event.event.cascaded.cascaded.tag == 'controlOut')
      );
    }));
  }

  ngOnDestroy() {
    clearInterval(this._interval);
    this._subs.forEach(sub => sub.unsubscribe());
  }

  private _setHeight() {
    if (this.type == CardType.value) this.node.box.height = 0;
    else if (this.type == CardType.expr)
      this.node.box.height = this.inner.nativeElement.offsetHeight - 24;
    else
      this.node.box.height = this.inner.nativeElement.offsetHeight;
  }

  public pick(event) {
    event.node = this.node;
    this.editor.pickEvent(event);
  }

  public unpick() {
    if (this.picked)
      this.editor.unpickEvent();
  }

  public get picked() {
    return this.editor.isPicked(this.node);
  }

  public get selected() {
    return this.editor.isSelected(this.node) || this.activeInTester;
  }

  public get activeInTester() {
    if (!this.tester.active || !this._recordingEvents) return false;

    let passed = this._recordingEvents.filter(event => event.time <= this.tester.playbackPosition);
    if (passed.length > 0 &&
        passed[passed.length - 1].event.cascaded.cascaded.event == 'activate')
      return true;

    return this.tester.events.some(event =>
      event.event.tag == 'node' &&
      event.event.cascaded.tag == this.node.tag &&
      event.event.cascaded.cascaded.event == 'activate'
    );
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
    if (event.target.value.length > 0) {
      this.focusedInputVal = event.target.value;
      if (this.type == CardType.expr) {
        let expr = this.node as Expr;
        this.decomposedFIVal = decomposeCode(expr.code, this.focusedInputVal);
      }
    }
    else
      this.decomposedFIVal = null;
  }

  public inputChange(input, event) {
    let newVal = event.target.value;
    input.label = newVal;
    if (this.decomposedFIVal) {
      if (this.type == CardType.expr) {
        let expr = this.node as Expr;
        expr.code = recomposeCode(this.decomposedFIVal, newVal);
      }

      this.focusedInputVal = newVal;
    }
  }

  public get suggestPaths() {
    let call = this.node as Call;
    if (this._suggesting)
      return this.registry.allPaths
            .filter(path => path.startsWith(call.path))
            .slice(0, 8);
    else return null;
  }

  newCase() {
    if (this.type == CardType.switch) {
      (this.node as Switch).cases.add('');
    }
  }

  newInput() {
    if (this.type == CardType.expr) {
      (this.node as Expr).in.add('');
    }
  }

  sanitizeInput(input) {
    if (input.cleared) {
      this.model.removePinLinks(input.pin);
      this.node.in.remove(input);
    }
  }

  sanitizeControl(control) {
    if (control.cleared) {
      this.model.removePinLinks(control.pin);
      this.node.control.remove(control);
    }
  }

  @HostListener('document:keyup', ['$event'])
  keypress(event: KeyboardEvent) {
    if (event.keyCode == 27) {
      if (this.editor.isSelected(this.node))
        this.editor.deselect();
      if (this._suggesting) this._suggesting = false;
    }
  }
}
