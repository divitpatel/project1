import { ActivatedRoute } from '@angular/router';
import { Component, NgModule, ChangeDetectorRef } from '@angular/core';
import { ErrorLogging } from '../model/errorlogmodel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorLogServiceComponent } from '../services/errorlog.service.component';
import { errorLoggingList } from '../data/errorlogdata';
import { ErrorDetailComponent } from '../errorlog_details/errorlogdetails.component';
import { debug } from 'util';
import { NgRedux } from '@angular-redux/store';
import { MessagingService } from '../../Shared/messaging/messagingService';
import {
	TableColumn,
	ColumnMode
} from '@swimlane/ngx-datatable';
import {
	ERROR_LOG_LOADING,
	ERROR_LOG_FAILED,
	ERROR_LOG_SUCCESS
} from '../../Billing/billing.action-types';
import { Page } from "../model/page";

@Component({
	selector: 'my-pagination',
	templateUrl: './errorloglist.component.html',
})
export class ErrorLoggingComponent {
	showDialog = false;
	page = new Page();
	rows = [

	];
	temp = [];
	listFileter: string;
	filteredItems: ErrorLogging[];
	errorlogdetails: ErrorLogging;
	pageSize: number = 5;
	pageNumber: number = 1;
	searchparam: string = '';
	currentIndex: number = 1;
	items: ErrorLogging[];
	pagesIndex: Array<number>;
	pageStart: number = 1;
	inputName: string = '';
	errordetails: string = '';
	count: number = 200;
	private filter = [];
	private sortBy: string = "userName";
	private sortOrder;
	private sortDisplayText = "User Name";
	private filterTags = [];
	private billingRecordNotFound;
	private totalElements;
	private viewportWidth;
	private filterInProgress;
	private clientSearch;
	summary;
	isNextPageLoading;
	summaryLoadingFailed;
	progressIndicatorMessage;
	demographicData;
	taxId;
	constructor(private ngRedux: NgRedux<ErrorLogging>, private modalService: NgbModal,
		private msgService: MessagingService,
		private errorLogService: ErrorLogServiceComponent,
		private route: ActivatedRoute,
		private _changeDetectorRef: ChangeDetectorRef) {
		var objerror = new ErrorLogging();
		this.errorlogdetails = objerror;
		this.fetchrecordsfromservice(1, '');

	};
	loadingProgressIndicator(status, filterInProgress?) {
		this.ngRedux.dispatch({
			type: ERROR_LOG_LOADING,
			payload: { status, filterInProgress },
		});
	}
	setPage(pageInfo) {
		this.page.pageNumber = pageInfo.offset;
	}
	nextpageclick() {
		this.pageNumber = parseInt(this.pageNumber.toString()) + 1
		this.fetchrecordsfromservice(this.pageNumber, this.searchparam);

	}
	prvpageclick() {
		this.pageNumber = Number.parseInt(this.pageNumber.toLocaleString()) - Number.parseInt('2');
		this.fetchrecordsfromservice(this.pageNumber, this.searchparam);
	}
	fetchrecordsfromservice(pagenumber: number, searchparam: string) {
		this.errorLogService.fetchErrorLog(pagenumber, searchparam)
			.subscribe((response) => {
				this.filterInProgress = new Array<ErrorLogging>();
				this.filteredItems = JSON.parse(response._body);
				this.loadingProgressIndicator(false, false);
			},
				(e) => {
					this.loadingProgressIndicator(true, false);
					this.ngRedux.dispatch({ type: ERROR_LOG_FAILED, payload: true });
					const errmsg = 'eRROR lOG  is not available right now, Please try later!!!';
					this.msgService.error(errmsg);
				},
		);
	}
	errorclickevent(rowdata) {
		this.errorlogdetails = this.filteredItems.filter(item => item._id === rowdata._id)[0];
		this.showDialog = true;
	}
	updateFilter(searchparam) {
		debugger;
		const val = searchparam;
		this.pageNumber = 1;
		this.searchparam = val;
		this.fetchrecordsfromservice(1, val)



	}

}
