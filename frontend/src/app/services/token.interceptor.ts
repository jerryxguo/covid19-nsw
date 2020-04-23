import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

declare var alertify: any


@Injectable()

export class TokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token = environment.token;
    if (token) {
      request = request.clone({
          setHeaders: {
              Authorization: `Bearer ${token}`
          }
      });
    }
    else{
      //for testing
      //return this.fakeResponse();
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        alertify.set('notifier','position', 'bottom-left');
        const text = error.status + ": " + error.statusText;
        alertify.error(text);
        return throwError(error);
    }));
  }

  fakeResponse() : Observable<HttpEvent<any>>  {
    let body = {
      "userName": 'username',
      "token": 'fake-jwt-token',
      "expiresIn": 600,
      "tokenType":"Bearer"
    };
    return of(new HttpResponse({ status: 200, body }));
  }
}

