import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const _ConnectPanelToken: string = '__connect_panel_token';

@Injectable()
export class TokenService {

  private _token: string = null;
  private _urlBefore: string = '/';

  constructor(private router: Router) { }

  get token(): string {
    if (this._token === null) {
      this._token = localStorage.getItem(_ConnectPanelToken) || '';
    }

    return this._token;
  }

  set token(_token: string) {
    this._token = _token;
    localStorage[_ConnectPanelToken] = _token;
  }

  reset() {
    if (this.token !== null) {
      this.token = null;
      this.router.navigate(['auth']);
    }
  }

  request() {
    let tree = this.router.parseUrl(this.router.url);
    if (tree.queryParamMap.has('token')) {
      let token = tree.queryParamMap.get('token');
      if (token != this.token) {
        this.token = token;
        let _url = this.router.url;
        this.router.navigate(['auth']).then(() => {
          this.router.navigateByUrl(_url);
        });
        return;
      }
    }

    this._urlBefore = this.router.url;
    this.router.navigate(['auth']);
  }

  goback() {
    this.router.navigateByUrl(this._urlBefore || '/');
  }
}
