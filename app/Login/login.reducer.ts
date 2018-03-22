import { REPORT_SUMMARY_LOADING } from './../Reporting/action-types';
import { IAppState } from './../Shared/store/IAppState';
import { LoggedInUserInfo } from './../Shared/Interface/userProfile';
import { LOGIN_SUCCESS } from './login.action';

export const initialState: IAppState = {
  loggedInUserInfo: null,
  jwtToken:null,
  config: null,
  errorMap: null
};

/**
 *
 * @param state Initial state is no state is provided else take the state value
 * @param action Redux action object with structure of {type,payload}
 */
export function LoginReducer(state = initialState, action): IAppState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, ...action.payload}
    case 'LOGIN_FAIL':
      return state;
    case 'CLIENT_CONFIG':
      return { ...state, config: action.payload}
    case 'CLIENT_CONFIG_FETCH_ERROR':
      return { ...state, config: action.payload}
    case 'ERRORMAP_CONFIG':
      return { ...state, errorMap: action.payload}
    case 'ERRORMAP_CONFIG_FETCH_ERROR':
      return { ...state, errorMap: action.payload}
    default:
      return state;
  }
}
