import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { BackendService } from '../../services/backend.service';

import { NodesComponent } from './nodes/nodes.component';
import { ConfigComponent } from './config/config.component';


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
    if (path == 'nodes') target = NodesComponent;
    if (path == 'config') target = ConfigComponent;

    if (!target || target == this.currentComponent) return;

    this.navigating = true;
    setTimeout(() => {
      this.currentComponent = target;
      this.navigating = false;
    }, 150);
  }

  get path() {
    if (this.currentComponent == NodesComponent) return 'nodes';
    if (this.currentComponent == ConfigComponent) return 'config';
  }
}
