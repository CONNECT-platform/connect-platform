import { Injectable } from '@angular/core';

@Injectable()
export class EditorModelService {
  public nodes;
  public links;

  constructor() {
    this.nodes = [];
    this.links = [];
  }
}
