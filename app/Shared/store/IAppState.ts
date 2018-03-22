import { LoggedInUserInfo } from './../Interface/userProfile';

/* Defining structure of Redux Store
 */
export interface IAppState {
  loggedInUserInfo: LoggedInUserInfo,
  jwtToken:string,
  config: any,
  errorMap: any
}
