import { Component, OnInit, Input } from '@angular/core';

import { NodelistStateService } from '../../../../services/nodelist-state.service';


@Component({
  selector: 'nodelist-entry',
  templateUrl: './nodelist-entry.component.html',
  styleUrls: ['./nodelist-entry.component.css']
})
export class NodelistEntryComponent implements OnInit {

  @Input() entry: any;
  @Input() prepath: string;
  @Input() query: string = '';
  @Input() expanded: boolean = undefined;

  constructor(
    private state: NodelistStateService,
  ) { }

  ngOnInit() {
    if (this.expanded == undefined) {
      if (this.entry.folder)
        this.expanded = this.state.savedState(this.path);
      else this.expanded = false;
    }
  }

  private _matching(entry) {
    if (!entry.folder) {
      return entry.content.path.indexOf(this.query) != -1;
    }
    else {
      return entry.content.some(e => this._matching(e));
    }
  }

  public get matching(): boolean {
    return this._matching(this.entry);
  }

  public toggle() {
    if (this.entry.folder) {
      this.expanded = !this.expanded;
      this.state.updateState(this.path, this.expanded);
    }
  }

  public get path() {
    if (this.entry.folder) return this.entry.path;
    else return this.entry.content.path;
  }

  public get postpath(): string {
    let path;
    if (this.entry.folder) path = this.entry.path;
    else path = this.entry.content.path;

    if (this.prepath)
      return path.substr(this.prepath.length);
    else return path;
  }
}
