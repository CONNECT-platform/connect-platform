import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class BackendService {
  private api: string = "http://localhost:4000/panel/";

  constructor(private http : HttpClient) { }

  fetchRegistry() {
    return this.http.get<{registry: any}>(this.api + 'registry');
  }
}
