import { Injectable } from '@angular/core';

import { EditorModelService } from './editor-model.service';


@Injectable()
export class TesterService {
  private _active : boolean = false;

  constructor(
    private editorModel : EditorModelService,
  ) { }

  public activate() {
    this._active = true;
  }

  public deactivate() {
    this._active = false;
  }

  public get active() {
    return this._active;
  }
}
