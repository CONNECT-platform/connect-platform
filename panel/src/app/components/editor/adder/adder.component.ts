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

  @Input() disabled: boolean = false;
  @Input() style;
  @Output() add : EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  activate() {
    if (this.disabled || this.state !== AdderStates.initial) return;

    this.state = AdderStates.activate;
    setTimeout(() => this.reset(), 300);
  }

  reset() {
    if (this.disabled || this.state !== AdderStates.activate) return;

    this.state = AdderStates.reset;
    this.add.emit();
    setTimeout(() => this.state = AdderStates.initial, 300);
  }

  get controlStyle() {
    return this.style == 'switch' || this.style == 'control';
  }
}
