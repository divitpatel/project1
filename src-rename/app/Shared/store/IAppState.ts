import { LoggedInUserInfo } from './../Interface/userProfile';

/* Defining structure of Redux Store
 */
export interface IAppState {
  loggedInUserInfo: LoggedInUserInfo,
  config: any,
  errorMap: any
}
