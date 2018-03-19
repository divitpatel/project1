import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Http, Headers, Response } from '@angular/http';

@Injectable()
export class BillingService {
  private BASE_URL = '/apps/ptb/api/bob/billing/summary';
  private DEMOGRAPHIC_URL = '/apps/ptb/api/clientDetails';
  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  fetchBilling(nextPageParams) {
    const queryStrArray = nextPageParams.filter.length && nextPageParams.filter.map((item, index) => {
      return (index === 0 ? item.option + "::" + item.value : "|" + item.option + "::" + item.value);
    });

    let url = `${this.BASE_URL}/${nextPageParams.userId}?page=${nextPageParams.pageNumber}&size=20&sort=${nextPageParams.sort}`;
    url = queryStrArray ? url += `&filter=${queryStrArray.join("")}` : url;

    return this.http.get(url, { headers: this.headers })
      .map((response: Response) => {
        return response;
      })
      .catch((e) => {
        console.log('-error--', e);
        return Observable.throw(e);
      });
  }

  fetchDemographic(nextPageParams) {
    let url;
    if(nextPageParams.marketSegment === 'Small Group')
    url = `${this.DEMOGRAPHIC_URL}/groupInfo/${nextPageParams.groupId}?sourceSystemId=${nextPageParams.ssid}`;
    else
    url = `${this.DEMOGRAPHIC_URL}/${nextPageParams.clientID}?mbrUid=${nextPageParams.muid}`;

    return this.http.get(url, { headers: this.headers })
      .map((response: Response) => {
        return response;
      })
      .catch((e) => {
        console.log('-error--', e);
        return Observable.throw(e);
      });
  }

  clientSearch({ taxId, searchBy, searchTerm }) {
    let url = `/apps/ptb/api/client/search/${taxId}?filter=${searchBy}::${searchTerm}`;
    
    return this.http.get(url, { headers: this.headers })
      .map((response: Response) => {
        return response;
      })
      .catch((e) => {
        console.log('-error--', e);
        return Observable.throw(e);
      });
  }
}
