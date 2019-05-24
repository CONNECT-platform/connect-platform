import { Component, OnInit, ViewChild, Input, HostListener } from '@angular/core';


export type CommandList = {[key: string]:  Command };

export interface Command {
  name: string;
  callback?: () => void;
  children?: CommandList;
}

@Component({
  selector: 'command-palette',
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.css']
})
export class CommandPaletteComponent implements OnInit {

  @ViewChild('overlay') overlay;
  @Input() commands: CommandList;

  current: CommandList = {};
  list: string[];

  constructor() { }

  ngOnInit() {
  }

  public activate() {
    setTimeout(() => {
      this.overlay.activate();
      this.set(this.commands);
    }, 20);
  }

  set(list: CommandList) {
    this.current = list;
    this.list = Object.keys(this.current);
  }

  @HostListener('document:keydown', ['$event'])
  public key(event) {
    if (event.key == 'Enter' && (event.ctrlKey || event.metaKey)) {
      if (this.overlay.active) {
        this.overlay.close();
      }
      else {
        this.activate();
      }
    }

    if (this.overlay.active) {
      if (event.key in this.current) {
        let cmd = this.current[event.key];

        if (cmd.callback) {
          cmd.callback();
          this.overlay.close();
        }
        else if (cmd.children) {
          this.set(cmd.children);
        }
      }
    }
  }
}
