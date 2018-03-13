import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { BackendService } from '../../services/backend.service';


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

  constructor(
    private backend: BackendService
  ) { }

  ngOnInit() {
  }

}
