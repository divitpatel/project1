import { UrlHelper } from '@anthem/http';
import { AppSession, AppConfig } from '@anthem/main';
import { Injectable, Inject } from '@angular/core';

// istanbul ignore next
/**
 *  Acts as app session
 */
@Injectable()
export class AppSession2 extends AppSession {

  constructor(
    private appConfig: AppConfig,
    urlHelper: UrlHelper) {
    super(appConfig, urlHelper);
    this.metaData.brandCd = this.getBrand();
  }

  getLoginUrl(brand: string = '') {
    let url = (<any>this.appConfig).web.loginEndpoints.anthemEndpoint;
    const brandAcronym = (brand !== undefined) ? brand : this.getBrand();
    switch (brandAcronym) {
      case 'ABC':
        url = (<any>this.appConfig).web.loginEndpoints.caEndpoint;
        break;
      case 'BCBSGA':
        url = (<any>this.appConfig).web.loginEndpoints.bcbsgaEndpoint;
        break;
      case 'EBCBS':
        url = (<any>this.appConfig).web.loginEndpoints.empireBlueEndpoint;
        break;
    }

    return url;
  }

  getDirectLoginUrl(brand: string = '') {
    let url = (<any>this.appConfig).web.directLoginEndPoints.anthemEndpoint;
    const brandAcronym = (brand !== undefined) ? brand : this.getBrand();
    switch (brandAcronym) {
      case 'ABC':
        url = (<any>this.appConfig).web.directLoginEndPoints.caEndpoint;
        break;
      case 'BCBSGA':
        url = (<any>this.appConfig).web.directLoginEndPoints.bcbsgaEndpoint;
        break;
      case 'EBCBS':
        url = (<any>this.appConfig).web.directLoginEndPoints.empireBlueEndpoint;
        break;
    }

    return url;
  }

  getBrand() {
    const a = window.location.href.toLowerCase();
    let b = 'ABCBS';

    if (a.indexOf('.bcbsga.com') >= 0) {
      b = 'BCBSGA';
    }else if (a.indexOf('.empireblue.com') >= 0) {
      b = 'EBCBS';
    }else if (a.indexOf('/ca/') >= 0) {
      b = 'ABC';
    }

    return b;
  }
}
