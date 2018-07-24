import { Component, OnInit, OnDestroy, AfterViewInit,
    ViewChild, ElementRef, Renderer } from '@angular/core';
import { Observable } from 'rxjs';

import { BackendService } from '../../../services/backend.service';
import { RepoService } from '../../../services/repo.service';
import { HintRef, HintService } from '../../../services/hint.service';


@Component({
  selector: 'home-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit, OnDestroy, AfterViewInit {

  _packages: { name: string; source: string }[] = [];

  _updateInterval: any;
  searching : boolean = false;
  @ViewChild('searchinput') searchInput : ElementRef;

  @ViewChild('installNPMOverlay') installNPMOverlay;
  @ViewChild('uninstallOverlay') uninstallOverlay;
  @ViewChild('uninstallingOverlay') uninstallingOverlay;
  @ViewChild('statusOverlay') statusOverlay;

  uninstallTarget: string;
  uninstallingTarget: string;
  packageStatus: any;

  private hintRef: HintRef;

  constructor(
    private backend: BackendService,
    private repo: RepoService,
    private renderer: Renderer,
    private hint: HintService,
  ) { }

  ngOnInit() {
    this._updateInterval = setInterval(() => {}, 200);
    this._update();
  }

  ngAfterViewInit() {
    this.uninstallOverlay.onClose.subscribe(() => {
      this.uninstallTarget = undefined;
    });

    this.uninstallingOverlay.onClose.subscribe(() => {
      this.uninstallingTarget = undefined;
    });

    this.statusOverlay.onClose.subscribe(() => {
      this.packageStatus = undefined;
    });
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

  install(name: string, source: string) {
    this.backend.installPackage({name, source}).subscribe(() => {
      this.installNPMOverlay.close();
      this._update();
    });
  }

  uninstall(name: string) {
    this.uninstallingTarget = name;
    this.uninstallOverlay.close();
    this.backend.uninstallPackage(name).subscribe(() => {
      this.uninstallingOverlay.close();
      this._update();
    });
  }

  status(pkg: {name: string, source: string}) {
    Observable.zip(
      this.backend.packageStatus(pkg.name),
      this.repo.package(pkg.name),
    )
    .subscribe(([status, repo]) => {
      this.packageStatus = Object.assign({}, pkg, repo);
      if (status.status)
        this.packageStatus = Object.assign(this.packageStatus, status.status);

      console.log(this.packageStatus);
    });
  }

  _update() {
    this.backend.packagesList().subscribe(response => {
      if (response.list) this._packages = response.list;
    });
  }
}
