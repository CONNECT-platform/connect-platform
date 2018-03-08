import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

import { EditorModelService } from './editor-model.service';


@Injectable()
export class BackendService {
  private api: string = "http://localhost:4000/panel/";

  constructor(
    private http : HttpClient,
    private location : Location,
    private model : EditorModelService,
  ) {
    if (!window['electron'])
      this.api = location.prepareExternalUrl(location.path());
  }

  fetchRegistry() {
    return this.http.get<{registry: any}>(this.api + 'registry');
  }

  save() {
    return this.http.post(this.api + 'save', { signature : this.model.json});
  }
}
