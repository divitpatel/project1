import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { NgRedux, dispatch } from '@angular-redux/store';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { LoginService } from './Login/loginService';
import { LoginActions } from './Login/login.action';
import { setTimeout } from 'timers';
import { loadavg } from 'os';
import { Response } from '@angular/http/src/static_response';
import { IAppState } from './shared/store';

@Injectable()
export class AuthGuard implements CanActivate {
  public redirectUrl: string;
  public isLoggedin: boolean = false;

  constructor(private router: Router,
    private loginService: LoginService,
    private loginAction: LoginActions,
    private ngRedux: NgRedux<IAppState>) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // console.log("deepLinking cookie in authGuard:", document.cookie);

    this.redirectUrl = state.url.split('?')[0];
    const temp = this.redirectUrl.split('/');
    const path = temp[1];
    const userId = this.getCookie("userId");
    return this.checkLogin(path, userId);

  }

  checkLogin(path, userId): boolean {
    if (this.isLoggedin) {
      return true;
    } else {
      this.loginService.handleLogin(userId)
        .subscribe((data) => {
          this.ngRedux.dispatch({
            type: LOGIN_SUCCESS,
            payload: data,
          });
          const taxId = data.loggedInUserInfo.producer.encryptedTaxId;
          this.isLoggedin = true;
          if (path === 'content' || path === 'contactus')
            this.router.navigate([path])  
          else
            this.router.navigate([path, taxId]);
        }, (err) => {
          this.isLoggedin = false;
          this.router.navigate(['/login']);
        })

    }
  }

  getCookie(name) {
    const nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}

