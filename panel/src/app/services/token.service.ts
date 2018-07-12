import { Injectable } from '@angular/core';

const _ConnectPanelToken: string = '__connect_panel_token';

@Injectable()
export class TokenService {

  private _token: string = null;

  constructor() { }

  get token(): string {
    if (this._token === null) {
      this._token = localStorage.getItem(_ConnectPanelToken) || '';
    }

    return this._token;
  }

  set token(_token: string) {
    this._token = _token;
  }
}
