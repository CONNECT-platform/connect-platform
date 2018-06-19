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
    delete : 'delete',
    test : 'test',
    watch: 'watch',
    watchResult: 'watch/result',
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

  delete() {
    return this.http.delete(this.api + BackendService.apiCalls.delete + '/' + this.model.id);
  }

  load(id) {
    return this.http.get<{node: any}>(this.api + BackendService.apiCalls.load + `/${id}`);
  }

  test(inputs) {
    return this.http.post<any>(
      this.api + BackendService.apiCalls.test,
      {
        model : this.model.json,
        inputs: inputs,
      });
  }

  watch() {
    return this.http.post<void>(
      this.api + BackendService.apiCalls.watch,
      {
        model: this.model.json
      }
    );
  }

  watchResult() {
    return this.http.get<any>(this.api + BackendService.apiCalls.watchResult + `/?path=${this.model.path}`);
  }

  public get nodes() {
    return this.http.get<{nodes : any}>(this.api + BackendService.apiCalls.nodes);
  }

  public get address() {
    return this.api;
  }
}
