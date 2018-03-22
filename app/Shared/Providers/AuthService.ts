import { Injectable,Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http,Headers } from '@angular/http';
import { NgRedux,dispatch,select } from '@angular-redux/store';
import { LoginActions } from './../../Login/login.action';
import { IAppState } from '../store';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


@Injectable()
export class AuthService {

  private refreshTokenCall;
  private token;
  private loginaction;

  constructor(private http:Http, private ngRedux:NgRedux<IAppState>, private injector:Injector){
    this.loginaction = injector.get(LoginActions);
    this.ngRedux.select(['LoginReducer','jwtToken']).subscribe(val => this.token=val )
  }
  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });

  getToken() {
    if(this.token){
     // return Observable.of(this.token);
     return this.token;
    }
    return this.refreshToken();
  }
  saveToken(token) {
   // this.loginaction.saveJWTToken(token);
    this.ngRedux.dispatch({
      type: 'SAVE_TOKEN',
      payload: token,
    })
  }
  refreshToken():Observable<any> {
    if (!this.refreshTokenCall) {
      const url = '/apps/ptb/api/refreshToken'
      return this.http.post(url,{}, { headers: this.headers })
      //.map(res=>res)
      .do(this.saveToken.bind(this))
      .finally(() => this.refreshTokenCall = null);
    }
  }

  logOutUser(){
    console.log('--Log Out the user--')
    Observable.empty();
  }

}