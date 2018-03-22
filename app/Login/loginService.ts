import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/throw';
import { Http, Headers, Response } from '@angular/http';
import { LoggedInUserInfo } from '../Shared/Interface/userProfile';

@Injectable()
export class LoginService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private data$: Observable<any>;

  private BASE_URL = '/apps/ptb/ng/api';
  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  handleLogin(userId?) {
    const url = userId ? `${this.BASE_URL}/user/${userId}` : `${this.BASE_URL}/userProfile`;
    this.data$ =  this.http.get(url, { headers: this.headers })
      .map((response: Response) => {
        this.loggedIn.next(true);
        return response.json();
      })
      .catch((e) => {
        console.log('-error--', e);
        return Observable.throw(e);
      })
      .share();
    
    return this.data$
  }

  getClientConfig(userId) {
    const url = `${this.BASE_URL}/config`
    return this.http.get(url, { headers: this.headers })
    .map((response: Response) => {
      return response;
    })
    .catch ((e) => {
      console.log('-error--', e);
      return Observable.throw(e);
    });
  }

  getErrorMap(userId) {
    const url = `${this.BASE_URL}/errorMap`
    return this.http.get(url, { headers: this.headers })
    .map((response: Response) => {
      return response;
    })
    .catch ((e) => {
      console.log('-error--', e);
      return Observable.throw(e);
    });
  }

}
