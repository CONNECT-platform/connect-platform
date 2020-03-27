
import { share } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';


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

    let handle = next.handle(request).pipe(share());
    handle.subscribe(()=>{},
      (error:HttpErrorResponse) => {
        if (error.error == 'unauthorized' || error.status == 401) {
          this.token.request();
        }
      });
    return handle;
  }
}
