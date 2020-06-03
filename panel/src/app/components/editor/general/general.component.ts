import { Component, OnInit } from '@angular/core';
import { EditorModelService } from '../../../services/editor-model.service';
import { TesterService } from '../../../services/tester.service';


@Component({
  selector: 'editor-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  constructor(
    private _model: EditorModelService,
    private _tester: TesterService,
  ) { }

  get model() {
    return this._model;
  }

  get tester() {
    return this._tester;
  }

  ngOnInit() {
  }

  toggleAccess() {
    if (this.tester.active) return;

    if(this.model.public) {
      this.model.public = false;
    } else {
      if(this.model.socket) {
        this.model.socket = false;
        this.model.public = true;
      } else {
        this.model.socket = true;
      }
    }
  }

  nextMethod() {
    if (this.tester.active) return this.model.method;

    if (this.model.method == 'GET') return 'POST';
    if (this.model.method == 'POST') return 'PUT';
    if (this.model.method == 'PUT') return 'DELETE';
    if (this.model.method == 'DELETE') return 'GET';
    return 'GET';
  }
}
