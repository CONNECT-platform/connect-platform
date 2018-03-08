import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';


@Injectable()
export class BackendService {
  private api: string = "http://localhost:4000/panel/";

  constructor(private http : HttpClient, private location: Location) {
    if (!window['electron'])
      this.api = location.prepareExternalUrl(location.path());
  }

  fetchRegistry() {
    return this.http.get<{registry: any}>(this.api + 'registry');
  }
}
