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

  communicating : boolean = false;
  reverting: boolean = false;
  playing: boolean = false;

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

    this.tester.onRecording.subscribe(() => this.communicating = true);
    this.tester.onRecordingFinished.subscribe(() => this.communicating = false);
    this.tester.onPlay.subscribe(() => this.playing = true);
    this.tester.onPause.subscribe(() => this.playing = false);
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

  editMode() {
    this.tester.deactivate();
  }

  delete() {
    this.communicating = true;
    this.reverting = true;

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

  @HostListener('document:keyup', ['$event'])
  keypress(event) {
    if (event.keyCode == 27 && this.state == EditorState.adding)
      this.state = EditorState.initial;
  }
}
