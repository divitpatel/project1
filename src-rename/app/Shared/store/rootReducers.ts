import { LoggedInUserInfo } from './../Interface/userProfile';
import { LOGIN_SUCCESS, LOGIN_FAIL } from './../../Login/login.action';
import { IAppState } from './IAppState';
import { combineReducers } from 'redux';
import { routerReducer } from '@angular-redux/router';
import { LoginReducer } from './../../Login/login.reducer';
import { BillingReducer } from './../../Billing/billing.reducer';
import { ReportingReducer } from './../../Reporting/reducer';


/*Comibining all the reducers to one. This will be required later while creating Redux store in AppModule */
export const rootReducer = combineReducers<IAppState>({
  LoginReducer,
  BillingReducer,
  ReportingReducer,
  router: routerReducer,
});
