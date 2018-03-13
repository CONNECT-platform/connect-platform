import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer } from '@angular/core';

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

  private _updateInterval;

  searching : boolean = false;

  @ViewChild('searchinput') searchInput : ElementRef;

  constructor(
    private renderer : Renderer,
    private backend : BackendService,
    private registry : RegistryService,
  ) { }

  ngOnInit() {
    this.backend.nodes.subscribe(data => {
      this._nodes = Object.entries(data.nodes).map(entry => {
          return {
            path: entry[0],
            id: entry[1],
          }
        });
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

  public toggleSearch() {
    if (this.searching) {
      if (!this.searchInput.nativeElement.value) {
        this.searching = false;
      }
    }
    else {
      this.searching = true;
      setTimeout(() => {
        this.renderer.invokeElementMethod(
          this.searchInput.nativeElement, 'focus', []);
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
