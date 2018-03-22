import { LoggedInUserInfo } from './../Shared/Interface/userProfile';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../Shared/store';
import { LoginService } from './loginService';
import { MessagingService } from './../Shared/messaging/messagingService';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const CLIENT_CONFIG = 'CLIENT_CONFIG';
export const CLIENT_CONFIG_FETCH_ERROR = 'CLIENT_CONFIG_FETCH_ERROR';
export const ERRORMAP_CONFIG = 'ERRORMAP_CONFIG';
export const ERRORMAP_CONFIG_FETCH_ERROR = 'ERRORMAP_CONFIG_FETCH_ERROR';

@Injectable()
export class LoginActions {

  constructor(private ngRedux: NgRedux<IAppState>,
    private loginService: LoginService, private router: Router, private msgService: MessagingService) { }

  performLogin(userId, logedIn?) {
    this.loginService.handleLogin(userId)
      .subscribe((data) => {
        const taxId = data.loggedInUserInfo.producer.encryptedTaxId;
        this.router.navigate(['/billing', taxId]);
        this.ngRedux.dispatch({
          type: LOGIN_SUCCESS,
          payload: data,
        });
        this.fetchClientConfig();
        this.fetchErrorMap();
      },
      (e) => {
        const errmsg = JSON.parse(e._body);
        this.msgService.error(errmsg.error.error.message);
      },

    );
  }

  fetchClientConfig() {
    this.loginService.getClientConfig('param')
    .subscribe((data) => {
      this.ngRedux.dispatch({
        type: CLIENT_CONFIG,
        payload:  { data: JSON.parse(data._body) }
      });
    },
       (e) => {
         this.ngRedux.dispatch({
           type: CLIENT_CONFIG_FETCH_ERROR,
           payload:  { error: JSON.parse(e.responseJSON) }
         });
       },
     );
  }

  fetchErrorMap() {
    this.loginService.getErrorMap('param')
    .subscribe((data) => {
      this.ngRedux.dispatch({
        type: ERRORMAP_CONFIG,
        payload:  { data: JSON.parse(data._body) }
      });
    },
       (e) => {
         this.ngRedux.dispatch({
           type: ERRORMAP_CONFIG_FETCH_ERROR,
           payload: { error: JSON.parse(e.responseJSON) }
         });
       },
     );
  }

}
