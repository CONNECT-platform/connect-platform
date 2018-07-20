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
    nodes: 'nodes',

    test : 'test',
    watch: 'watch',
    watchResult: 'watch/result',

    config: {
      root: 'config/',
      save: 'save',
      load: 'load',
    },

    vault: {
      root: 'vault/',
      list: 'list',
      put: 'put',
      get: 'get',
      delete: 'delete',
    },
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

  fetchConfig() {
    return this.http.get<any>(this.api + BackendService.apiCalls.config.root
        + BackendService.apiCalls.config.load);
  }

  updateConfig(config) {
    return this.http.put<any>(
      this.api + BackendService.apiCalls.config.root + BackendService.apiCalls.config.save,
      {
        config: config,
      });
  }

  vaultList() {
    return this.http.get<any>(this.api + BackendService.apiCalls.vault.root
        + BackendService.apiCalls.vault.list);
  }

  vaultGet(key: string) {
    return this.http.get<any>(this.api + BackendService.apiCalls.vault.root
        + BackendService.apiCalls.vault.get + `/?key=${key}`);
  }

  vaultPut(key: string, content: string) {
    return this.http.put<any>(
      this.api + BackendService.apiCalls.vault.root + BackendService.apiCalls.vault.put,
      {
        key: key,
        content: content,
      });
  }

  vaultDelete(key: string) {
    return this.http.delete(this.api + BackendService.apiCalls.vault.root
        + BackendService.apiCalls.vault.delete + '/' + key);
  }

  public get nodes() {
    return this.http.get<{nodes : any}>(this.api + BackendService.apiCalls.nodes);
  }

  public get address() {
    return this.api;
  }
}
