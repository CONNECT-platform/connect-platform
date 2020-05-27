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
    socket?: boolean;
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
      console.log({ data });
      this._nodes = [];
      for(let k in data.nodes) {
        const entry = data.nodes[k];
        console.log({k, entry});

        if(Array.isArray(entry)) {
          for(let c in entry) {
            const id = entry[c] as string;
            this._nodes.push({
              path: k,
              id
            });
          }
        } else {
          this._nodes.push({
            path: k,
            id: entry as string,
          });
        }
      }

      this._entries = this.folderize(this.nodes);
      console.log('entries', this._entries);
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

    const ret = [];
    for(let path in subfolders) {
      const entries = subfolders[path];

      if (entries.length > 1) {

        const content = [];
        for(let e in entries) {
          content.push({
            folder: false,
            content: entries[e]
          });
        }

        ret.push({
          folder: true,
          path: initialpath + '/' + path,
          content
        });
      } else if (entries.length == 1) {
        ret.push({
          folder: false,
          content: entries[0]
        });
      } else {
        ret.push({
          folder: true,
          path: initialpath + '/' + path,
          content: this.folderize(entries, initialpath + '/' + path)
        });
      }
    }

    console.log(ret);
    return ret;
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
      let signature = this.registry.signature(node.path, node.id);

      node.public = signature.public;
      node.method = signature.method;
      node.socket = signature.socket;
    }
  }
}
