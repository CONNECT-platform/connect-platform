import { Component, OnInit, OnDestroy, AfterViewInit,
    ViewChild, ElementRef, Renderer } from '@angular/core';

import { BackendService } from '../../../services/backend.service';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, OnDestroy, AfterViewInit {

  _updateInterval: any;
  searching : boolean = false;
  @ViewChild('searchinput') searchInput : ElementRef;

  _services: any[];
  selected: any;
  selectedInfo: any;
  @ViewChild('overlay') overlay;
  @ViewChild('removeOverlay') removeOverlay;

  constructor(
    private renderer: Renderer,
    private backend: BackendService,
  ) { }

  ngOnInit() {
    this._updateInterval = setInterval(() => {}, 200);
    this._update();
  }

  ngAfterViewInit() {
    this.overlay.onActivate.subscribe(() => {
      if (this.selected)
        this.backend.serviceInfo(this.selected.name).subscribe(response => {
          if (response.info) this.selectedInfo = response.info;
        });
    });
    this.overlay.onClose.subscribe(() => {
      this.selected = undefined;
    });
  }

  ngOnDestroy() {
    clearInterval(this._updateInterval);
  }

  public get services() {
    if (this._services)
      return this._services.filter(
        service => service.name.indexOf(this.searchInput.nativeElement.value) != -1 ||
                  service.url.indexOf(this.searchInput.nativeElement.value) != -1);
    else return [];
  }

  public save(name: string, url: string) {
    this.backend.saveService(name, url).subscribe(response => {
      this.overlay.close();
      this._update();
    });
  }

  public remove(name: string) {
    this.backend.removeService(name).subscribe(response => {
      this.overlay.close();
      this.removeOverlay.close();
      this._update();
    });
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
    this.backend.services.subscribe(response => {
      if (response.list)
        this._services = response.list;
    })
  }
}
