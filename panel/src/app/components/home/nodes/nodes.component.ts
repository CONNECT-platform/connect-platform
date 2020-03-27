import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { BackendService } from '../../../services/backend.service';
import { RegistryService } from '../../../services/registry.service';


@Component({
  selector: 'home-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit, OnDestroy {

  private _nodes : Array<{
    path: string;
    id: string;
    public?: boolean;
    method?: string}> = [];

  private _entries: any[];

  private _updateInterval;

  searching : boolean = false;
  @ViewChild('searchinput', { static: true }) searchInput : ElementRef;

  constructor(
    private renderer : Renderer2,
    private backend : BackendService,
    private registry : RegistryService,
  ) { }

  ngOnInit() {
    this.backend.nodes.subscribe(data => {
      this._nodes = Object.entries(data.nodes).map(entry => {
          return {
            path: entry[0],
            id: entry[1] as string,
          }
        });
      this._entries = this.folderize(this.nodes);
    });

    this._update();
    this._updateInterval = setInterval(() => this._update(), 200);
  }

  ngOnDestroy() {
    clearInterval(this._updateInterval);
  }

  public get nodes() {
    return this._nodes.filter(n => n.path.indexOf(this.searchInput.nativeElement.value) != -1);
  }

  public get entries() {
    return this._entries;
  }

  private folderize(nodelist, initialpath='') {
    if (initialpath.endsWith('/'))
      initialpath = initialpath.substr(0, initialpath.length - 1);

    let anchor = initialpath.split('/').length;
    let subfolders: {[key: string]:any[]} = {};

    nodelist.forEach(node => {
      let path = node.path.split('/');
      let subfolder = '';
      if (path.length > anchor) subfolder = path[anchor];
      if (!(subfolder in subfolders)) subfolders[subfolder] = [];
      subfolders[subfolder].push(node);
    });

    return Object.entries(subfolders).map(([path, entries]) => {
      if (entries.length == 1)
        return {
          folder: false,
          content: entries[0]
        };
      else return {
        folder: true,
        path: initialpath + '/' + path,
        content: this.folderize(entries, initialpath + '/' + path)
      }
    });
  }

  public get empty() {
    return this._nodes.length == 0;
  }

  public toggleSearch() {
    if (this.searching) {
      if (!this.searchInput.nativeElement.value) {
        this.searching = false;
      }
    }
    else {
      this.searching = true;
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 10);
    }
  }

  private _update() {
    for (let node of this._nodes) {
      let signature = this.registry.signature(node.path);
      node.public = signature.public;
      node.method = signature.method;
    }
  }
}
