import { Component, OnInit, OnDestroy,
        Input, ViewChild, ElementRef, HostListener } from '@angular/core';

import { EditorService, EditorEvents } from '../../../services/editor.service';
import { EditorModelService } from '../../../services/editor-model.service';
import { TesterService } from '../../../services/tester.service';
import { HintRef, HintService } from '../../../services/hint.service';

import { RegistryService } from '../../../services/registry.service';
import { BackendService } from '../../../services/backend.service';
import { Node, NodeEvents } from '../../../models/node.model';
import { Pin, PinType } from '../../../models/pin.model';
import { PinListItem } from '../../../models/pin-list.model';
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
  private _lastPickTime;

  public hintRef : HintRef;

  public selectionCandidate: boolean = false;
  public deselectionCandidate: boolean = false;

  constructor(
    private editor: EditorService,
    private model : EditorModelService,
    private tester: TesterService,
    private registry : RegistryService,
    private hint: HintService,
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
        if (this.registry.isRegistered(path)) {
          call.adopt(this.registry.signature(path), (pin: Pin) => {
            this.model.removePinLinks(pin);
          });
        }
        else {
          this.model.removeNodeLinks(call);
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
      this._recordingEvents = recording.filter(event => this.relevantEvent(event));
    }));
  }

  ngOnDestroy() {
    clearInterval(this._interval);
    this._subs.forEach(sub => sub.unsubscribe());
  }

  public relevantEvent(event) {
    return this.node.relevantEvent(event);
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

    if (this._lastPickTime &&
        (Date.now() - this._lastPickTime) < 200 &&
        this.node instanceof Call &&
        (this.node as Call).path in this.registry.nodes) {
      window.open(`/panel/editor?id=${this.registry.nodes[(this.node as Call).path]}`, '_blank');
    }
    this._lastPickTime = Date.now();
  }

  public unpick(event) {
    if (this.picked)
      this.editor.unpickEvent(event.shiftKey, event.ctrlKey || event.metaKey);
  }

  public get picked() {
    return this.editor.isPicked(this.node);
  }

  public get selected() {
    return this.editor.isSelected(this.node);
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

  public get errorInTester() {
    if (!this.tester.active || !this._recordingEvents) return null;

    let passed = this._recordingEvents.filter(event => event.time <= this.tester.playbackPosition);
    if (passed.length > 0 &&
        passed[passed.length - 1].event.cascaded.cascaded.event == 'error')
      return passed[passed.length - 1];

    let candidates = this.tester.events.filter(event =>
      event.event.tag == 'node' &&
      event.event.cascaded.tag == this.node.tag &&
      event.event.cascaded.cascaded.event == 'error'
    );
    if (candidates.length > 0) return candidates[0];
    return null;
  }

  public mouseover(event?, target?:PinListItem, path?: string) {
    if (this.hintRef) this.hintRef.clear();
    let err = this.errorInTester;
    if (err) {
      this.hintRef = this.hint.display(err.event.cascaded.cascaded.data.message);
    }
    else {
      if (this.node instanceof Call) {
        if (path) {
          event.stopPropagation();
          let hints = this.registry.hints(path);
          if (hints && hints.node)
            this.hintRef = this.hint.display(hints.node);
        }
        else {
          let hints = (this.node as Call).signature.hints;
          if (hints) {
            if (!target && hints.node)
              this.hintRef = this.hint.display(hints.node);
            else {
              event.stopPropagation();
              if (target.pin.type == PinType.input && hints.inputs && hints.inputs[target.label])
                this.hintRef = this.hint.display(hints.inputs[target.label])
              else if (target.pin.type == PinType.output && hints.outputs && hints.outputs[target.label])
                this.hintRef = this.hint.display(hints.outputs[target.label])
              else if (target.pin.type == PinType.control && hints.controlOutputs && hints.controlOutputs[target.label])
                this.hintRef = this.hint.display(hints.controlOutputs[target.label]);
            }
          }
        }
      }
    }
  }

  public mouseout() {
    if (this.hintRef) {
      this.hintRef.clear();
      this.hintRef = undefined;
    }
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
            .filter(path => !path.endsWith('/'))
            .slice(0, 8);
    else return null;
  }

  public expand() {
    if (this.node instanceof Expr) {
      this.editor.deselect();
      this.editor.expanded = this.node;
    }
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

  removeInput(input) {
    this.model.removePinLinks(input.pin);
    this.node.in.remove(input);
  }

  removeOptional(optin) {
    this.model.removePinLinks(optin.pin);
    optin.pin.active = false;
  }

  sanitizeControl(control) {
    if (control.cleared) {
      this.model.removePinLinks(control.pin);
      this.node.control.remove(control);
    }
  }

  removeControl(control) {
    this.model.removePinLinks(control.pin);
    this.node.control.remove(control);
  }

  subfocus(event) {
    this.editor.deselect();
    event.stopPropagation();
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
