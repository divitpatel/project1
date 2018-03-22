import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../Shared/store';
import { BillingService } from './billingService';
import { MessagingService } from './../Shared/messaging/messagingService';
import {
  FETCH_BILLING_SUMMARY,
  BILLING_SUMMARY_LOADING,
  FETCH_BILLING_SUMMARY_FAILED,
  FETCH_DEMOGRAPHIC_SUCCESS,
  FETCH_DEMOGRAPHIC_FAILED,
  BILLING_RECORD_NOTFOUND,
  SEARCH_CLIENTS_SUCCESS,
  SEARCH_CLIENTS_FAILED
} from './billing.action-types';



@Injectable()
export class BillingActions {
  constructor(private ngRedux: NgRedux<IAppState>, private billingService: BillingService, private router: Router, private msgService: MessagingService) { }

  loadingProgressIndicator(status, filterInProgress?) {
    this.ngRedux.dispatch({
      type: BILLING_SUMMARY_LOADING,
      payload: { status, filterInProgress },
    });
  }

  fetchBillingSummary(nextPageParams) {
    this.loadingProgressIndicator(true, nextPageParams.filterInProgress || false);
    this.billingService.fetchBilling(nextPageParams)
      .subscribe((response) => {
        let billingSummary = response  //JSON.parse(response._body);
        if (!billingSummary)
          this.ngRedux.dispatch({ type: BILLING_RECORD_NOTFOUND, payload: true });
        else {
          this.ngRedux.dispatch({ type: FETCH_BILLING_SUMMARY, payload: billingSummary });
          // this.ngRedux.dispatch({ type: FETCH_BILLING_SUMMARY_FAILED, payload: false });
        }

        this.loadingProgressIndicator(false, false);
      },
      (e) => {
        this.loadingProgressIndicator(true, false);
        this.ngRedux.dispatch({ type: FETCH_BILLING_SUMMARY_FAILED, payload: true });
        const errmsg = 'Billing Summary is not available right now, Please try later!!!';
        this.msgService.error(errmsg);
      },
    );
  }

  fetchDemographicData(params) {
    this.billingService.fetchDemographic(params)
      .subscribe((response) => {
        let demographicData = JSON.parse(response._body);
        this.ngRedux.dispatch({ type: FETCH_DEMOGRAPHIC_SUCCESS, payload: demographicData });
      },
      (e) => {
        this.ngRedux.dispatch({ type: FETCH_DEMOGRAPHIC_FAILED });
      },
    );
  }

  clientSearch(params) {
    this.billingService.clientSearch(params)
      .subscribe(response => {
        let searchData = response._body ? JSON.parse(response._body) : {};
        this.ngRedux.dispatch({ type: SEARCH_CLIENTS_SUCCESS, payload: searchData });
      },
      (err) => {
        console.log("searchClients failed:", err)
        this.ngRedux.dispatch({ type: SEARCH_CLIENTS_FAILED });
        const errMsg = "Unable to perform search. Please try later";
        this.msgService.error(errMsg);
      });
  }
}
