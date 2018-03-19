import { Injectable } from '@angular/core';
import { IAppConfig } from '@anthem/main';

/**
 *  App configuration settings
 */
@Injectable()
export class AppConfig2 implements IAppConfig {
  audit: any = {
    batchTimerInSeconds: 10,
    batchItemsMax: 100,
  };
  restApi: any = {
    baseUrl: '',
    twoFactor: {
      verifyOtp: '/cns/test/jsons/valOtp.json',
      sendOtp: '/cns/test/jsons/sendOtp.json',
      saveDfp: '/cns/test/jsons/saveDfp.json',
    },
  };
  web: any = undefined;
  wcs: any = undefined;
  logging: any = {
    batchTimerInSeconds: 10,
    batchItemsMax: 100,
    logLevelApi: 'INFO',
    enable: true,
  };
  httpInterceptor: any = undefined;
  environment: any = undefined;
  addWebGuid: string;
  loginEndpoints: any = undefined;
  directLoginEndPoints: any = undefined;

  // istanbul ignore next
  constructor() {
    // nop
  }

}
