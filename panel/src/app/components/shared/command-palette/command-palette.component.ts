import { Component, OnInit, ViewChild, Input, HostListener } from '@angular/core';


export type CommandList = {[key: string]:  Command };

export interface Command {
  name: string;
  direct?: string;
  callback?: () => void;
  children?: CommandList;
}

@Component({
  selector: 'command-palette',
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.css']
})
export class CommandPaletteComponent implements OnInit {

  @ViewChild('overlay', { static: true }) overlay;

  _commands: CommandList = {};
  current: CommandList = {};
  list: string[];
  directs: {[key: string] : Command} = {};


  constructor() { }

  ngOnInit() {
  }

  @Input() public set commands(cmds: CommandList) {
    if (cmds != this._commands) {
      this._commands = cmds;
      this.set(cmds);

      this.directs = {};
      Object.values(this.current).forEach(cmd => this.fillDirects(cmd));
    }
  }

  public get commands(): CommandList {
    return this._commands;
  }

  public activate(cmds?: CommandList) {
    setTimeout(() => {
      this.overlay.activate();
      this.set(cmds || this.commands);
    }, 20);
  }

  set(list: CommandList) {
    this.current = list;
    this.list = Object.keys(this.current);
  }

  fillDirects(command: Command) {
    if (command.direct) {
      this.directs[command.direct] = command;
      if (command.children) {
        Object.values(command.children).forEach(cmd => this.fillDirects(cmd));
      }
    }
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

      return;
    }

    if ((event.ctrlKey || event.metaKey) && !this.overlay.active) {
      if (event.key in this.directs) {
        this.exec(this.directs[event.key]);
        return;
      }
    }

    if (this.overlay.active) {
      if (event.key in this.current) {
        event.stopPropagation();
        event.preventDefault();
        this.exec(this.current[event.key]);
      }
    }
  }

  exec(cmd: Command) {
    if (cmd.callback) {
      cmd.callback();
      this.overlay.close();
    }
    else if (cmd.children) {
      if (!this.overlay.active)
        this.activate(cmd.children);
      else
        this.set(cmd.children);
    }
  }
}
