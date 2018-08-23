import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { BackendService } from '../../services/backend.service';

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
export class HomeComponent implements OnInit {

  currentComponent: any;
  navigating: boolean = false;

  constructor(
    private backend: BackendService
  ) { }

  ngOnInit() {
    this.currentComponent = NodesComponent;
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
}
