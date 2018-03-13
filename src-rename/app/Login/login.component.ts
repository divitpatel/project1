import { Component, OnInit } from '@angular/core';
import { LoginActions } from './login.action';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { LoggedInUserInfo } from '../Shared/Interface/userProfile';
import { IAppState } from '../Shared/store';
import { Router } from '@angular/router';

@Component({
  selector: 'login-bp',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @select('loggedInUserInfo') loggedInUserInfo$: Observable<LoggedInUserInfo>;

  constructor(private ngRedux: NgRedux<IAppState>
    , private router: Router
    , private loginAction: LoginActions) { }
  ngOnInit() {
    console.log(this.router);
  }

  onLoginClick = (userId) => {
    this.loginAction.performLogin(userId);
  }

}

