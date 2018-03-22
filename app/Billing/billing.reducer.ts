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


export interface BillingState {
  billingSummary: any,
  summaryLoading: boolean,
  summaryLoadingFailed: boolean,
  billingDemographic: any,
  billingDemographicFailed: boolean,
  billingRecordNotFound: boolean,
  filterInProgress: boolean,
  clientSearch: any,
  clientSearchFailed: boolean,
};

export const initialState: BillingState = {
  billingSummary: null,
  summaryLoading: false,
  summaryLoadingFailed: false,
  billingDemographic: null,
  billingDemographicFailed: false,
  billingRecordNotFound: null,
  filterInProgress: null,
  clientSearch: null,
  clientSearchFailed: false
};

/**
*
* @param state Initial state is no state is provided else take the state value
* @param action Redux action object with structure of {type,payload}
*/
export function BillingReducer(state = initialState, action): BillingState {
  switch (action.type) {
    case FETCH_BILLING_SUMMARY:
      let summary = [];
      let metadata = action.payload.metadata;
      let payloadReceived = action.payload;
      let currentBatchDetails = action.payload.billingSummary;

      if (action.payload.metadata.page.number == 1) {
        summary = currentBatchDetails;
      }
      else if (parseInt(action.payload.metadata.page.number) > parseInt(state.billingSummary.metadata.page.number)) {
        summary = state.billingSummary.billingSummary;
        Array.prototype.push.apply(summary, currentBatchDetails)
        //currentBatchDetails.map(item => summary.push(item))
      }
      action.payload.billingSummary = summary;
      action.payload.metadata = metadata;
      return { ...state, billingSummary: action.payload, billingRecordNotFound: false, summaryLoadingFailed: false }

    case FETCH_BILLING_SUMMARY_FAILED:
      return { ...state, summaryLoadingFailed: action.payload }
    case BILLING_SUMMARY_LOADING:
      return { ...state, summaryLoading: action.payload.status, filterInProgress: action.payload.filterInProgress }
    case FETCH_DEMOGRAPHIC_SUCCESS:
      return { ...state, billingDemographic: action.payload }
    case FETCH_DEMOGRAPHIC_FAILED:
      return { ...state, billingDemographicFailed: true }
    case BILLING_RECORD_NOTFOUND:
      return { ...state, billingRecordNotFound: action.payload }
    case SEARCH_CLIENTS_SUCCESS:
      return { ...state, clientSearch: action.payload.clientSearch }
    case SEARCH_CLIENTS_FAILED:
      return { ...state, clientSearchFailed: action.payload }
    default:
      return state;
  }
}
