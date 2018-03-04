import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';


enum AdderStates {
  initial, activate, reset,
}

@Component({
  selector: 'editor-adder',
  templateUrl: './adder.component.html',
  styleUrls: ['./adder.component.css']
})
export class AdderComponent implements OnInit {

  states = AdderStates;
  state = AdderStates.initial;

  @Input() style;
  @Output() add : EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  activate() {
    this.state = AdderStates.activate;
    setTimeout(() => this.reset(), 300);
  }

  reset() {
    this.state = AdderStates.reset;
    this.add.emit();
    setTimeout(() => this.state = AdderStates.initial, 300);
  }

  get controlStyle() {
    return this.style == 'switch' || this.style == 'control';
  }
}
