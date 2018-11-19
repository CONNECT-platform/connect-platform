import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Link } from '../../models/link.model';
import { Expr } from '../../models/expr.model';
import { Value } from '../../models/value.model';
import { Switch } from '../../models/switch.model';
import { Call } from '../../models/call.model';
import { Box } from '../../models/box.model';
import { Node } from '../../models/node.model';
import { RegistryService } from '../../services/registry.service';
import { EditorService, EditorEvents } from '../../services/editor.service';
import { EditorModelService } from '../../services/editor-model.service';
import { TesterService } from '../../services/tester.service';
import { BackendService } from '../../services/backend.service';


enum EditorState {
  initial, adding, selected,
}

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  animations: [
    trigger('container', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms ease-in-out')
      ]),
      transition(':leave', [
        style({opacity: 0}),
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class EditorComponent implements OnInit, OnDestroy {

  private states = EditorState;
  private state: EditorState = EditorState.initial;

  private selectHandle;
  private deselectHandle;

  @ViewChild('deleteOverlay') deleteOverlay;
  @ViewChild('deletedOverlay') deletedOverlay;

  @ViewChild('testInputOverlay') testInputOverlay;
  @ViewChild('testInputEditor') testInputEditor;
  @ViewChild('testErrorDetailsOverlay') testErrorDetailsOverlay;

  @ViewChild('codeOverlay') codeOverlay;

  @ViewChild('timeline') timeline;

  communicating : boolean = false;
  reverting: boolean = false;
  playing: boolean = false;

  targetTestInput: string = undefined;

  aceOptions: any = {
    showGutter: false,
    maxLines: Infinity,
    showPrintMargin: false,
    tabSize: 2,
  }

  aceExpandedOptions: any = {
    showGutter: true,
    maxLines: Infinity,
    showPrintMargin: false,
    tabSize: 2,
  }

  private subs = [];

  constructor(
    private registry : RegistryService,
    private model : EditorModelService,
    private editor: EditorService,
    private tester: TesterService,
    private backend : BackendService,
    private route : ActivatedRoute,
    private router : Router,
  ) { }

  ngOnInit() {
    this.subscribe();

    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.backend.load(params.id).subscribe(data => {
          this.model.load(params.id, data.node, this.registry);
        });
      }
      else this.model.reset();
    });

    this.tester.deactivate();
    this.tester.cleanUp();
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

    this.subs.push(this.tester.onRecording.subscribe(() => this.communicating = true));
    this.subs.push(this.tester.onRecordingFinished.subscribe(() => this.communicating = false));
    this.subs.push(this.tester.onPlay.subscribe(() => this.playing = true));
    this.subs.push(this.tester.onPause.subscribe(() => this.playing = false));

    let tryPlayback = false;

    this.subs.push(this.tester.onMissingInput.subscribe(input => {
      tryPlayback = true;
      this.changeTestInput(input);
    }));

    this.testInputOverlay.onClose.subscribe(() => {
      this.timeline.keysEnabled = true;

      if (tryPlayback) {
        tryPlayback = false;
        setTimeout(() => this.tester.togglePlayback(), 200);
      }
    });

    this.testErrorDetailsOverlay.onClose.subscribe(() => {
      this.editor.deselect();
    });

    this.codeOverlay.onClose.subscribe(() => {
      this.editor.expanded = undefined;
    });
  }

  private unsubscribe() {
    this.editor.unsubscribe(EditorEvents.select, this.selectHandle);
    this.editor.unsubscribe(EditorEvents.deselect, this.deselectHandle);

    this.subs.forEach(sub => sub.unsubscribe());
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
    this.communicating = true;

    this.backend.save().subscribe(response => {
      if (response.id) {
        this.model.id = response.id;
      }
      setTimeout(() => this.communicating = false, 2000);
    }, error => {
      //TODO: properly announce the error.
      //
      console.log(error);
      setTimeout(() => this.communicating = false, 2000);
    });
  }

  confirmDeletion() {
    this.deleteOverlay.activate();
  }

  testMode() {
    this.tester.activate();
  }

  setTestValue() {
    if (this.targetTestInput) {
      this.testInputOverlay.close();

      this.tester.setInput(this.targetTestInput, this.testInputEditor.getEditor().getValue());
      this.tester.validateInputs();
    }
  }

  changeTestInput(input) {
    if (this.tester.active) {
      this.targetTestInput = input;
      this.testInputEditor.getEditor().setValue(this.tester.getInput(this.targetTestInput));
      this.testInputOverlay.activate();
      this.timeline.keysEnabled = false;
      this.testInputEditor.getEditor().focus();
    }
  }

  editMode() {
    this.tester.deactivate();
  }

  delete() {
    this.communicating = true;
    this.reverting = true;

    this.deleteOverlay.close();

    this.backend.delete().subscribe(response => {
      setTimeout(() => {
        this.communicating = false;
        this.reverting = false;
        this.deletedOverlay.activate().onClose.subscribe(() => {
          this.router.navigate(['']);
        });
      }, 2000);
    }, error => {
      //TODO: properly announce the error.
      //
      console.log(error);
      setTimeout(() => this.communicating = false, 2000);
    });
  }

  public get testErrorDetails() {
    if (this.state == EditorState.selected && this.tester.active &&
        this.editor.selectTarget instanceof Node) {
      return this.editor.selectTarget.component.errorInTester;
    }

    return null;
  }

  @HostListener('document:keyup', ['$event'])
  keyup(event) {
    if (event.keyCode == 27 && this.state == EditorState.adding)
      this.state = EditorState.initial;
  }

  @HostListener('document:keydown', ['$event'])
  keydown(event) {
    let charChode = String.fromCharCode(event.which).toLowerCase();
    if ((event.metaKey || event.ctrlKey) && charChode == 's') {
      event.preventDefault();
      this.save();
    }

    if (event.key === 'Delete' && this.state == EditorState.selected) {
      this.mainAction();
    }
  }
}
