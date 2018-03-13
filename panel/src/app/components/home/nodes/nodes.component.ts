import { Component, OnInit, OnDestroy } from '@angular/core';

import { BackendService } from '../../../services/backend.service';
import { RegistryService } from '../../../services/registry.service';


@Component({
  selector: 'home-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit, OnDestroy {

  nodes : Array<{
    path: string;
    id: string;
    public?: boolean;
    method?: string}> = [];

  private _updateInterval;

  constructor(
    private backend : BackendService,
    private registry : RegistryService,
  ) { }

  ngOnInit() {
    this.backend.nodes.subscribe(data => {
      this.nodes = Object.entries(data.nodes).map(entry => {
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

  private _update() {
    for (let node of this.nodes) {
      let signature = this.registry.signature(node.path);
      node.public = signature.public;
      node.method = signature.method;
    }
  }
}
