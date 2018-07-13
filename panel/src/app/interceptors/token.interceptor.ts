import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { TokenService } from '../services/token.service';



@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private token: TokenService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'connect_token': this.token.token
      }
    });

    let handle = next.handle(request);
    handle.subscribe(()=>{},
      (error:HttpErrorResponse) => {
        if (error.error == 'unauthorized' || error.status == 401) {
          this.token.request();
        }
      });

    return handle;
  }
}
