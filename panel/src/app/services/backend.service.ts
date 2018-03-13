import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

import { EditorModelService } from './editor-model.service';


@Injectable()
export class BackendService {
  private api: string = "http://localhost:4000/panel/";

  public static apiCalls = {
    registry : 'registry',
    save : 'save',
    load : 'load',
    nodes: 'nodes',
  }

  constructor(
    private http : HttpClient,
    private location : Location,
    private model : EditorModelService,
  ) {
    if (!window['electron']) {
      this.api = window.location.origin + location.prepareExternalUrl('');
    }
  }

  fetchRegistry() {
    return this.http.get<{registry: any}>(this.api + BackendService.apiCalls.registry);
  }

  save() {
    return this.http.post
      <{ id: string, }>
      (this.api + BackendService.apiCalls.save,
        { id : this.model.id, signature : this.model.json});
  }

  load(id) {
    return this.http.get<{node: any}>(this.api + BackendService.apiCalls.load + `/${id}`);
  }

  public get nodes() {
    return this.http.get<{nodes : any}>(this.api + BackendService.apiCalls.nodes);
  }

  public get address() {
    return this.api;
  }
}
