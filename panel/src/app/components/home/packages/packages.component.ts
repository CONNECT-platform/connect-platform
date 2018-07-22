import { Component, OnInit, OnDestroy,
    ViewChild, ElementRef, Renderer } from '@angular/core';

import { BackendService } from '../../../services/backend.service';
import { HintRef, HintService } from '../../../services/hint.service';


@Component({
  selector: 'home-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit, OnDestroy {

  _packages: { name: string; source: string }[] = [];

  _updateInterval: any;
  searching : boolean = false;
  @ViewChild('searchinput') searchInput : ElementRef;

  private hintRef: HintRef;

  constructor(
    private backend: BackendService,
    private renderer: Renderer,
    private hint: HintService,
  ) { }

  ngOnInit() {
    this._updateInterval = setInterval(() => {}, 200);
    this._update();
  }

  ngOnDestroy() {
    clearInterval(this._updateInterval);
  }

  get empty(): boolean {
    return this._packages.length == 0;
  }

  get packages() {
    return this._packages.filter(
      pkg => pkg.name.indexOf(this.searchInput.nativeElement.value) != -1);
  }

  public set tooltip(text: string) {
    if (this.hintRef) this.hintRef.clear();
    if (text) this.hintRef = this.hint.display(text);
  }

  public toggleSearch() {
    if (this.searching) {
      if (!this.searchInput.nativeElement.value) {
        this.searching = false;
      }
    }
    else {
      this.searching = true;
      setTimeout(() => {
        this.renderer.invokeElementMethod(
          this.searchInput.nativeElement, 'focus', []);
      }, 10);
    }
  }

  _update() {
    this.backend.packagesList().subscribe(response => {
      if (response.list) this._packages = response.list;
    });
  }
}
