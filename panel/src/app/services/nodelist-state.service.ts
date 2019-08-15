import { Injectable } from '@angular/core';


const LSKEY = 'connect-platform-nodelist-state';

@Injectable()
export class NodelistStateService {
  list = undefined;

  constructor() { }

  fetch() {
    if (!this.list) {
      let lsvalue = localStorage.getItem(LSKEY);
      if (lsvalue) this.list = JSON.parse(lsvalue);
      else this.list = [];
    }
  }

  save() {
    localStorage.setItem(LSKEY, JSON.stringify(this.list));
  }

  public savedState(path: string) {
    this.fetch();
    return this.list.includes(path);
  }

  public updateState(path: string, state: boolean) {
    this.fetch();
    if (!state)
      this.list = this.list.filter(p => p != path);
    else if (!this.list.includes(path)) this.list.push(path);
    this.save();
  }
}
