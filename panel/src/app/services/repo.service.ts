import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { BackendService } from './backend.service';


@Injectable()
export class RepoService {
  private _repo: any;

  constructor(
    private backend: BackendService,
  ) { }

  private get repo(): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      if (this._repo) {
        observer.next(this._repo);
        observer.complete();
      }
      else {
        this.backend.packageRepo().subscribe(response => {
          if (response.repo) this._repo = response.repo;
          observer.next(this._repo);
          observer.complete();
        });
      }
    });
  }

  public package(name: string): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.repo.subscribe(repo => {
        let candidates = repo.packages.filter(pkg => pkg.name == name);

        if (candidates.length > 0)
          observer.next(candidates[0]);
        else
          observer.next({});

        observer.complete();
      });
    });
  }
}
