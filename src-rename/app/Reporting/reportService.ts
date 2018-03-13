import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ReportService {
  private BASE_URL = '/apps/ptb/api/reports';
  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private taxId;
  constructor(private _http: Http) { }

  createReport(reportCriteria) {
    const url = `${this.BASE_URL}/create/${reportCriteria.createdBy}`;
    this.taxId = reportCriteria.createdBy
    return this._http.post(url, reportCriteria, { headers: this.headers })
      .map((response: Response) => {
        this.getReports({userId: this.taxId});
        return response.json();
      })
      .catch(err => {
        console.log('error while creating a report', err);
        return Observable.throw(err);
      });
  }

  getReports(params) { 
    const queryStrArray = params.filter.length && params.filter.map((item, index) => {
      return (index === 0 ? item.option + "=" + item.value : "&" + item.option + "=" + item.value);
    });

    let url = `${this.BASE_URL}/summary/${params.userId}?page=${params.pageNumber}&size=20&sort=${params.sort}`;
    url = queryStrArray ? url += `&${queryStrArray.join("")}` : url;
  
    return this._http.get(url, { headers: this.headers })
      .map((response: Response) => response)
      .catch(err => Observable.throw(err));
  }
  
  getReportsSummaryXls(reportID) {
    const url = `${this.BASE_URL}/v1/${reportID}`;
    return this._http.get(url, { headers: this.headers })
      .map((response: Response) => response)
      .catch(err => Observable.throw(err));
  }

  deleteReport(id) {
    const url = `${this.BASE_URL}/delete/${id}`;
    return this._http.delete(url, { headers: this.headers })
      .map((response: Response) => response)
      .catch(err => Observable.throw(err));
  }
}
