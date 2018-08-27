import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { BackendService } from '../../services/backend.service';
import { TokenService } from '../../services/token.service';

import { NodesComponent } from './nodes/nodes.component';
import { ConfigComponent } from './config/config.component';
import { VaultComponent } from './vault/vault.component';
import { PackagesComponent } from './packages/packages.component';
import { ServicesComponent } from './services/services.component';


export const HomeComponentMappings = {
  nodes: NodesComponent,
  config: ConfigComponent,
  vault: VaultComponent,
  packages: PackagesComponent,
  services: ServicesComponent,
}

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('holder', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms ease-in-out')
      ]),
      transition(':leave', [
        style({opacity: 0}),
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {

  currentComponent: any;
  navigating: boolean = false;
  name: string = 'unnamed project';

  _updateInterval: any;

  constructor(
    private backend: BackendService,
    private token: TokenService,
  ) { }

  ngOnInit() {
    this.currentComponent = NodesComponent;
    this._updateInterval = setInterval(() => this._update(), 500);
  }

  ngOnDestroy() {
    clearInterval(this._updateInterval);
  }

  get loggedIn(): boolean {
    return this.token.token && this.token.token.length > 0;
  }

  logout() {
    this.token.reset();
  }

  set path(path: string) {
    if (this.navigating) return;

    let target = undefined;
    if (path in HomeComponentMappings)
      target = HomeComponentMappings[path];

    if (!target || target == this.currentComponent) return;

    this.navigating = true;
    setTimeout(() => {
      this.currentComponent = target;
      this.navigating = false;
    }, 150);
  }

  get path() {
    let candidates = Object.entries(HomeComponentMappings).filter(entry => entry[1] == this.currentComponent);
    if (candidates.length > 0) return candidates[0][0];
  }

  _update() {
    this.backend.name.subscribe(response => {
      if (response.name) this.name = response.name;
    })
  }
}
