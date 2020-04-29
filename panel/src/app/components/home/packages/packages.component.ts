import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { zip  } from 'rxjs';

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
  showcase: any;

  _updateInterval: any;
  searching : boolean = false;
  @ViewChild('searchinput', { static: true }) searchInput : ElementRef;

  @ViewChild('installOverlay', { static: true }) installOverlay;
  @ViewChild('installNPMOverlay', { static: true }) installNPMOverlay;
  @ViewChild('installCodeOverlay', { static: true }) installCodeOverlay;
  @ViewChild('uninstallOverlay', { static: true }) uninstallOverlay;
  @ViewChild('uninstallingOverlay', { static: true }) uninstallingOverlay;
  @ViewChild('statusOverlay', { static: true }) statusOverlay;

  uninstallTarget: string;
  uninstallingTarget: string;
  packageStatus: any;

  private hintRef: HintRef;

  options: any = {
    showGutter: false,
    maxLines: Infinity,
    tabSize: 2,
  }

  constructor(
    private backend: BackendService,
    private _repo: RepoService,
    private renderer: Renderer2,
    private hint: HintService,
  ) { }

  get repo() {
    return this._repo;
  }

  ngOnInit() {
    this._updateInterval = setInterval(() => {
      if (this.packageStatus && this.installed(this.packageStatus.name) &&
        (!this.packageStatus.installed || !this.packageStatus.provided)) {
        this.status(this.packageStatus);
      }
    }, 200);
    this._update();
  }

  ngAfterViewInit() {
    this.installOverlay.onActivate.subscribe(() => {

    });

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

  public get sampleConfig(): string {
    if (this.packageStatus && this.packageStatus.hints && this.packageStatus.hints.sampleConfig)
      return JSON.stringify(this.packageStatus.hints.sampleConfig, null, 2);

    return "";
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
        this.searchInput.nativeElement.focus();
      }, 10);
    }
  }

  install(name: string, source: string) {
    if (name) {
      this.backend.installPackage({name, source}).subscribe(() => {
        this.installNPMOverlay.close();
        this.installCodeOverlay.close();
        this.installOverlay.close();
        this._update();
      });
    }
  }

  uninstall(name: string) {
    this.uninstallingTarget = name;
    this.uninstallOverlay.close();
    this.backend.uninstallPackage(name).subscribe(() => {
      this.uninstallingOverlay.close();
      this.statusOverlay.close();
      this.installOverlay.close();
      this._update();
    });
  }

  installed(name: string) {
    return this._packages.some(pkg => pkg.name == name);
  }

  status(pkg: {name: string, source: string}) {
    zip(
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
      if (response.list) {
        this._packages = response.list;
        this._packages.forEach(pkg => {
          this.repo.package(pkg.name).subscribe(extra => {
            Object.assign(pkg, extra, pkg);
          });
        });
      }
    });
  }
}
