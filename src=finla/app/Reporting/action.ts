import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { saveAs } from "file-saver";

import { MessagingService } from './../Shared/messaging/messagingService';
import { IAppState } from '../Shared/store';
import { ReportService } from './reportService';
import {
  CREATE_REPORT_SUCCESS,
  CREATE_REPORT_ERROR,
  REPORTS_SUMMARY_SUCCESS,
  REPORTS_SUMMARY_FAILURE,
  REPORT_SUMMARY_LOADING,
  CREATING_REPORT,
  REPORT_RECORD_NOTFOUND
} from './action-types';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';

@Injectable()
export class ReportActions {
  private userId;
  constructor(private ngRedux: NgRedux<IAppState>, private reportService: ReportService, private msgService: MessagingService) { }

  loadingProgressIndicator(status,filterInProgress?) {
    this.ngRedux.dispatch({
      type: REPORT_SUMMARY_LOADING,
      payload: {status,filterInProgress},
    });
  }

  creatingAReportInProgress(status) {
    this.ngRedux.dispatch({
      type: CREATING_REPORT,
      payload: status
    });
  }

  createReport(reportCriteria) {
    this.userId = reportCriteria.createdBy
    this.creatingAReportInProgress(true);

    this.reportService.createReport(reportCriteria)
      .subscribe((reportCriteria) => {
        this.ngRedux.dispatch({
          type: CREATE_REPORT_SUCCESS,
          payload: reportCriteria,
        });


        const temp = { userId: this.userId, page: 1, size: 20 }
        this.getReports(temp);
      },
      (err) => {
        console.log('error while creating a report', err);
        this.ngRedux.dispatch({
          type: CREATE_REPORT_ERROR
        });
      },
    );
  }

  getReports(params) {
    this.loadingProgressIndicator(true, params.filterInProgress || false);
    this.reportService.getReports(params)
      .subscribe(reportsList => {
        let reportSummary = JSON.parse(reportsList._body)
        if (reportSummary){
          this.ngRedux.dispatch({ type: REPORTS_SUMMARY_SUCCESS, payload: reportSummary });
        }else {
          this.ngRedux.dispatch({ type: REPORT_RECORD_NOTFOUND, payload: true });
      }
        this.loadingProgressIndicator(false,false);
      },
      (err) => {
        this.loadingProgressIndicator(true, false);
        let errmsg = 'error while fetching Reports!!!';  //write your own custom msg
        if(params.filterErrorMsg==true){
          errmsg = 'Unable to filter report list. Please try later';
        }
        this.msgService.error(errmsg);
        console.log("error while fetching reports:", err);
        this.ngRedux.dispatch({
          type: REPORTS_SUMMARY_FAILURE,
          payload: true
        })
      })
  }

  generateFile(params) {
    this.reportService.getReportsSummaryXls(params.id)
      .subscribe(reportFile => {
        const blob = new Blob([reportFile._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        saveAs(blob, 'Report.csv');
      },
      (err) => {
        const errmsg = `Unable to download the requested renewal report ${params.name}. Please try later`;
        this.msgService.error(errmsg);
      })
  }

}
