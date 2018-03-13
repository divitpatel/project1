import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Http, Headers, Response } from '@angular/http';
import { LoggedInUserInfo } from '../Shared/Interface/userProfile';

@Injectable()
export class LoginService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  private BASE_URL = '/apps/ptb/api/user';
  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
    }

  handleLogin(userId) {
    const url = `${this.BASE_URL}/${userId}`;
    // TODO: Need to check if this can remain GET request or need to be POST...??
    return this.http.get(url, { headers: this.headers })
      .map((response: Response) => {
        this.loggedIn.next(true);
        return <LoggedInUserInfo>response.json().loggedInUserInfo;
      })
      .catch((e) => {
        console.log('-error--', e);
        return Observable.throw(e);
      });
  }

  getClientConfig(userId) {
    const url = "/apps/ptb/api/config"
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
    const url = "/apps/ptb/api/errorMap"
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
