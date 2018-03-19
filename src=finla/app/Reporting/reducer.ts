import { IAppState } from './../Shared/store/IAppState';
import { 
  CREATE_REPORT_SUCCESS, 
  CREATE_REPORT_ERROR, 
  REPORTS_SUMMARY_SUCCESS, 
  REPORTS_SUMMARY_FAILURE, 
  REPORT_SUMMARY_LOADING,
  CREATING_REPORT,
  REPORT_RECORD_NOTFOUND
} from './action-types';


export interface ReportingState {
  createReport: any,
  reportSummary:any,
  reportSummaryLoading: boolean,
  reportSummaryFailed: boolean,
  creatingReportInProgress: boolean,
  filterInProgress: boolean;
  reportRecordNotFound: boolean,
};


export const initialState: ReportingState = {
  createReport: null,
  reportSummary:null,
  reportSummaryLoading: false,
  reportSummaryFailed: false,
  filterInProgress: null,
  creatingReportInProgress: null,
  reportRecordNotFound: null,
};

/**
*
* @param state Initial state is no state is provided else take the state value
* @param action Redux action object with structure of {type,payload}
*/
export function ReportingReducer(state = initialState, action): ReportingState {
  switch (action.type) {
    case CREATING_REPORT:
      return { ...state, creatingReportInProgress: action.payload}
    case CREATE_REPORT_SUCCESS:
      return { ...state, createReport: action.payload , creatingReportInProgress: false}
    case CREATE_REPORT_ERROR:
      return { ...state, createReport: action.payload , creatingReportInProgress: false}
    case REPORTS_SUMMARY_SUCCESS:
        let summary = [];
        let metadata = action.payload.metadata;
        let payloadReceived = action.payload;
        let currentBatchDetails = action.payload.data;

        if (action.payload.metadata.page.number == 1) {
          summary = currentBatchDetails;
        }
        else if(parseInt(action.payload.metadata.page.number) > parseInt(state.reportSummary.metadata.page.number)) {
          summary = state.reportSummary.data;
          Array.prototype.push.apply(summary, currentBatchDetails)
          //currentBatchDetails.map(item => summary.push(item))
        }
        action.payload.data = summary;
        action.payload.metadata = metadata;
      return { ...state, reportSummary: action.payload }
    case REPORTS_SUMMARY_FAILURE:
        return { ...state, reportSummaryFailed: action.payload }
    case REPORT_SUMMARY_LOADING:
        return { ...state, reportSummaryLoading: action.payload.status , filterInProgress: action.payload.filterInProgress}
    case REPORT_RECORD_NOTFOUND:
          return { ...state, reportRecordNotFound: action.payload }
    default:
      return state;
  }
}
