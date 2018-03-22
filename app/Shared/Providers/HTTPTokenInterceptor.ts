import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { pipe } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/mergeMap';



import { AuthService } from './AuthService';

@Injectable()
export class RequestInterceptorService implements HttpInterceptor {
  private authservice: AuthService;
  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private injector: Injector) {
    this.authservice = this.injector.get(AuthService);
  }

  setHeaders(request) {
    return function (token) {
      return request.clone({
        setHeaders: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    };
  }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  }


  handleTokenRefreshScenario(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

     // Reset here so that the following requests wait until the token
     // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      return this.authservice.refreshToken()
                .map(newtoken => newtoken.json()) // doing map operator to get the json value from Observable
                .flatMap((newToken: string) => {
                  if (newToken) {
                    this.tokenSubject.next(newToken);
                    return next.handle(this.addToken(req, newToken));
                  }

                    // If we don't get a new token redirect the user to logout screen
                  return this.logoutUser();
                })
                .catch(error => {
                    // If there is an exception calling 'refreshToken'redirect the user to logout screen
                  return this.logoutUser();
                })
                .finally(() => {
                  this.isRefreshingToken = false;
                });
    } else {
      return this.tokenSubject
                .filter(token => token != null)
                .take(1)
                .switchMap(token => {
                  return next.handle(this.addToken(req, token));
                });
    }
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addToken(request, this.authservice.getToken()))
            .catch(error => { // Body of HttpErrorResponse is available on the error property
              if (error.error.status === 403 && error.error.message === 'Expired token') { 
                return this.handleTokenRefreshScenario(request, next);
              }
              return Observable.throw(error);
            });
        /*return this.authservice.getToken()
          .map(this.setHeaders(request))
          .mergeMap(next.handle)
          .catch(error => {
            if (error.status === 403) {
              return this.authservice.refreshToken()
                .map(this.setHeaders(request))
                .mergeMap(next.handle);
            }
            return Observable.throw(error);
          });*/
  }
  logoutUser() {
    return Observable.throw('');
  }

}
