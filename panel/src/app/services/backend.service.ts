import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import 'rxjs/add/operator/share';

import { EditorModelService } from './editor-model.service';


@Injectable()
export class BackendService {
  private api: string = "http://localhost:4000/panel/";

  public static apiCalls = {
    name: 'name',
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
      saveProd: 'prod/save',
      saveScript: 'script/save',
      load: 'load',
      loadProd: 'prod/load',
      loadScript: 'script/load',
    },

    vault: {
      root: 'vault/',
      list: 'list',
      put: 'put',
      get: 'get',
      delete: 'delete',
    },

    packages: {
      root: 'packages/',
      list: 'list',
      install: 'install',
      uninstall: 'uninstall',
      status: 'status',
      repo: 'repo',
    },

    services: {
      root: 'services/',
      list: 'list',
      save: 'save',
      remove: 'remove',
      info: 'info',
    },

    shellUrl: 'shell-url',
    version: 'version',
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

  public get name() {
    return this.http.get<any>(this.api + BackendService.apiCalls.name).share();
  }

  fetchRegistry() {
    return this.http.get<{registry: any}>(this.api + BackendService.apiCalls.registry).share();
  }

  save() {
    return this.http.post
      <{ id: string, }>
      (this.api + BackendService.apiCalls.save,
        { id : this.model.id, signature : this.model.json}).share();
  }

  delete() {
    return this.http.delete(this.api + BackendService.apiCalls.delete + '/' + this.model.id).share();
  }

  load(id) {
    return this.http.get<{node: any}>(this.api + BackendService.apiCalls.load + `/${id}`).share();
  }

  test(inputs, timelimit) {
    return this.http.post<any>(
      this.api + BackendService.apiCalls.test,
      {
        model : this.model.json,
        inputs: inputs,
        timelimit: timelimit,
      }).share();
  }

  watch(timelimit) {
    return this.http.post<void>(
      this.api + BackendService.apiCalls.watch,
      {
        model: this.model.json,
        timelimit: timelimit,
      }
    ).share();
  }

  watchResult() {
    return this.http.get<any>(this.api + BackendService.apiCalls.watchResult + `/?path=${this.model.path}`).share();
  }

  fetchConfig() {
    return this.http.get<any>(this.api + BackendService.apiCalls.config.root
        + BackendService.apiCalls.config.load).share();
  }

  fetchProdConf() {
    return this.http.get<any>(this.api + BackendService.apiCalls.config.root
        + BackendService.apiCalls.config.loadProd).share();
  }

  fetchConfScript() {
    return this.http.get<any>(this.api + BackendService.apiCalls.config.root
        + BackendService.apiCalls.config.loadScript).share();
  }

  updateConfig(config) {
    return this.http.put<any>(
      this.api + BackendService.apiCalls.config.root + BackendService.apiCalls.config.save,
      {
        config: config,
      }).share();
  }

  updateProdConf(config) {
    return this.http.put<any>(
      this.api + BackendService.apiCalls.config.root + BackendService.apiCalls.config.saveProd,
      {
        config: config,
      }).share();
  }

  updateConfScript(script) {
    return this.http.put<any>(
      this.api + BackendService.apiCalls.config.root + BackendService.apiCalls.config.saveScript,
      {
        script: script,
      }).share();
  }

  vaultList() {
    return this.http.get<any>(this.api + BackendService.apiCalls.vault.root
        + BackendService.apiCalls.vault.list).share();
  }

  vaultGet(key: string) {
    return this.http.get<any>(this.api + BackendService.apiCalls.vault.root
        + BackendService.apiCalls.vault.get + `/?key=${key}`).share();
  }

  vaultPut(key: string, content: string) {
    return this.http.put<any>(
      this.api + BackendService.apiCalls.vault.root + BackendService.apiCalls.vault.put,
      {
        key: key,
        content: content,
      }).share();
  }

  vaultDelete(key: string) {
    return this.http.delete(this.api + BackendService.apiCalls.vault.root
        + BackendService.apiCalls.vault.delete + '/' + key).share();
  }

  packagesList() {
    return this.http.get<any>(this.api + BackendService.apiCalls.packages.root
        + BackendService.apiCalls.packages.list).share();
  }

  installPackage(pkg: { name: string; source: string }) {
    return this.http.post<any>(
      this.api + BackendService.apiCalls.packages.root + BackendService.apiCalls.packages.install,
      pkg
    ).share();
  }

  uninstallPackage(name: string) {
    return this.http.post<any>(
      this.api + BackendService.apiCalls.packages.root + BackendService.apiCalls.packages.uninstall,
      {
        name: name
      }
    ).share();
  }

  packageStatus(name: string) {
    return this.http.get<any>(this.api + BackendService.apiCalls.packages.root
       + BackendService.apiCalls.packages.status + `?name=${name}`
    ).share();
  }

  packageRepo() {
    return this.http.get<any>(this.api + BackendService.apiCalls.packages.root
        + BackendService.apiCalls.packages.repo).share();
  }

  public get services() {
    return this.http.get<{list: any[]}>(this.api + BackendService.apiCalls.services.root
        + BackendService.apiCalls.services.list).share();
  }

  public saveService(name: string, url: string) {
    return this.http.post<any>(
      this.api + BackendService.apiCalls.services.root + BackendService.apiCalls.services.save,
      {
        name: name,
        url: url,
      }
    ).share();
  }

  public removeService(name: string) {
    return this.http.post<any>(
      this.api + BackendService.apiCalls.services.root + BackendService.apiCalls.services.remove,
      {
        name: name,
      }
    ).share();
  }

  public serviceInfo(name: string) {
    return this.http.get<any>(this.api + BackendService.apiCalls.services.root
        + BackendService.apiCalls.services.info + `?name=${name}`).share();
  }

  public get nodes() {
    return this.http.get<{nodes : any}>(this.api + BackendService.apiCalls.nodes).share();
  }

  public get address() {
    return this.api;
  }

  public get shellUrl() {
    return this.http.get<any>(this.api + BackendService.apiCalls.shellUrl).share();
  }

  public get version() {
    return this.http.get<any>(this.api + BackendService.apiCalls.version).share();
  }
}
