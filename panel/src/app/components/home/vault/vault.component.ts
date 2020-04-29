import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { BackendService } from '../../../services/backend.service';


@Component({
  selector: 'home-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css']
})
export class VaultComponent implements OnInit, AfterViewInit, OnDestroy {

  _keys: string[];
  dir: string;

  _updateInterval: any;

  toBeDeleted: string;
  selected: string;
  selectedContent: string;
  searching : boolean = false;

  @ViewChild('searchinput', { static: true }) searchInput : ElementRef;

  @ViewChild('addOverlay', { static: true }) addOverlay;
  @ViewChild('editOverlay', { static: true }) editOverlay;
  @ViewChild('deleteOverlay', { static: true }) deleteOverlay;

  constructor(
    private renderer: Renderer2,
    private backend: BackendService
  ) { }

  ngOnInit() {
    this._update();
    this._updateInterval = setInterval(() => {}, 200);
  }

  ngAfterViewInit() {
    this.editOverlay.onActivate.subscribe(() => {
      this.selectedContent = undefined;
      if (this._keys.includes(this.selected))
        this.backend.vaultGet(this.selected).subscribe(response => {
          if (response.content) this.selectedContent = response.content;
        });
    });

    this.editOverlay.onClose.subscribe(() => {
      this.selected = undefined;
      this._update();
    });

    this.deleteOverlay.onClose.subscribe(() => {
      this.toBeDeleted = undefined;
      this._update();
    })
  }

  ngOnDestroy() {
    clearInterval(this._updateInterval);
  }

  public get keys() {
    if (this._keys)
      return this._keys.filter(key => key.indexOf(this.searchInput.nativeElement.value) != -1);
    else return [];
  }

  public get empty() {
    if (this._keys)
      return this._keys.length == 0;
    else return true;
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
        this.searchInput.nativeElement.focus();
      }, 10);
    }
  }

  public add(key: string) {
    this.selected = key;
    this.addOverlay.close();
  }

  public save(content: string) {
    if (this.selected) {
      this.backend.vaultPut(this.selected, content).subscribe(() => {
        this.editOverlay.close();
      });
    }
  }

  public delete() {
    this.toBeDeleted = this.selected;
    this.editOverlay.close();
  }

  public confirmDeletion() {
    if (this.toBeDeleted) {
      this.backend.vaultDelete(this.toBeDeleted).subscribe(() => {
        this.deleteOverlay.close();
      });
    }
  }

  public cancelDeletion() {
    this.selected = this.toBeDeleted;
    this.deleteOverlay.close();
  }

  _update() {
    this.backend.vaultList().subscribe(response => {
      if (response.list) {
        this._keys = response.list.keys;
        this.dir = response.list.directory;
      }
    });
  }
}
