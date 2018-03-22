import { Component, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { OnInit, DoCheck, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgForm } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { IAppState } from '../Shared/store';
import { ReportActions } from './action';
import { ReportService } from './reportService';
import { BpClientAppService } from '../BpClientApp/bpClientApp.service';
import { MessagingService } from './../Shared/messaging/messagingService';

@Component({
  selector: 'bp-reporting',
  templateUrl: './Reporting.component.html',
  styleUrls: ['./Reporting.component.css'],

})
export class ReportingComponent implements OnInit {
  public filterOptions = filterConfig;
  private filter = [];
  public sortBy = 'submittedOn';
  public sortOrder;
  public sortDisplayText = 'By Date Created';
  public filterTags = [];
  public clientSearch;
  public viewportWidth;
  public filterInProgress;
  reportSummary;
  reportSummaryFailed;
  progressIndicatorMessage;
  isNextPageLoading;
  reportTitle;
  creatingAReportInProgress;
  deleteReportIndex = undefined;
  taxId;
  public reportRecordNotFound;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private reportActions: ReportActions,
    private _route: ActivatedRoute,
    private appService: BpClientAppService,
    private ref: ChangeDetectorRef,
    private messagingService: MessagingService,
    private reportService: ReportService
  ) {

        this.sortOrder = "Desc";
        this.viewportWidth = window.screen.width;
    }

    content = {
        dropDown2: {
            title: '',
            options: [
                {
                    label: 'By Date Created',
                    value: 'submittedOn'
                },
                {
                    label: 'By Report Type',
                    value: 'reportType'
                }
            ]
        }
    }

    ngOnInit() {
        this.viewportWidth = window.screen.width;
        this.taxId = this._route.snapshot.params['taxId'];
        const params = { userId: this.taxId, pageNumber: 1, size: 20 };
        this.getReportSummary(params);
        this.detachScrollHandler();
        this.ngRedux.select(['ReportingReducer', 'reportSummary']).subscribe(val => this.reportSummary = val);
        this.ngRedux.select(['ReportingReducer', 'reportSummaryFailed']).subscribe(val => this.reportSummaryFailed = val);
        this.ngRedux.select(['ReportingReducer', 'reportSummaryLoading']).subscribe(val => this.isNextPageLoading = val);
        this.ngRedux.select(['ReportingReducer', 'creatingReportInProgress']).subscribe(val => this.creatingAReportInProgress = val);
        this.ngRedux.select(['ReportingReducer', 'filterInProgress']).subscribe(val => this.filterInProgress = val);
        this.messagingService.clear();
        this.ngRedux.select(['ReportingReducer', 'reportRecordNotFound']).subscribe(val => this.reportRecordNotFound = val);

        this.appService.SetPageTitle("Reports");
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(event) {
        if (this.reportSummary && (this.reportSummary.metadata.page.number <= this.reportSummary.metadata.page.totalPages))
            this.handleScroll(this);
    }

    detachScrollHandler() {
        document.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll(self) {
        if (!this.isNextPageLoading) {
            let currentPage = self.reportSummary.metadata;
            if (parseFloat(currentPage.page.number) >= parseFloat(currentPage.page.totalPages)) {
                this.detachScrollHandler();
                return;
            } else {
                var body = document.body,
                    html = document.documentElement;

                var documentHeight = Math.max(body.scrollHeight, body.offsetHeight,
                    html.clientHeight, html.scrollHeight, html.offsetHeight);

                var inHeight = window.innerHeight;
                var scrollT;
                //For IE scroll issue fix
                if (typeof window.scrollY === "undefined") {
                    scrollT = document.documentElement.scrollTop;
                } else {
                    scrollT = window.scrollY;
                }
                var totalScrolled = scrollT + inHeight;
                if (totalScrolled + 500 > documentHeight) { //user reached at bottom
                    self.fetchNextPage(parseInt(currentPage.page.number) + 1)
                }
            }
        }
    }

    fetchNextPage(pageNumber) {
        const taxId = this._route.snapshot.params['taxId'];
        const nextPageParams = { userId: taxId, pageNumber: pageNumber, size: 20 };
        const lastRecords = parseInt(this.reportSummary.metadata.page.number) * parseInt(this.reportSummary.metadata.page.size);
        this.progressIndicatorMessage = lastRecords + " - " + (lastRecords + parseInt(this.reportSummary.metadata.page.size)) + " " + "loading... ";
        console.log(this.progressIndicatorMessage);
        this.getReportSummary(nextPageParams);
    }

    handleClickAction(reportDetails, index) {
        const params = { id: reportDetails.rowDetails.id, name: reportDetails.rowDetails.title };
        if (reportDetails.item.label === 'Download')
            this.reportActions.generateFile(params);
        else if (reportDetails.item.label === "Action")
            this.deleteReport(reportDetails, index);
    }

    renderReportSummary(val) {
        const customStyles = {
            fontSize: "18px",
            fontWeight: 400,
            color: "#0079c2",
            padding: "0 15px 0 0",
            cursor: "pointer",
        }
        let item = {
            mainColumn: {
                type: "full-column",
                link: "",
                label: "",
                content: (val.title) ? val.title : " - ",
            },
            columns: [
                {
                    type: "block",
                    link: "",
                    label: "Report Type",
                    content: (val.reportType) ? val.reportType : "-",
                },
                {
                    type: "block",
                    link: "",
                    label: "Description",
                    content: (val.description) ? val.description : " - ",
                },
                {
                    link: "",
                    type: "block",
                    label: "Date Created",
                    content: (val.submittedOn) ? val.submittedOn : " - ",
                },
                {
                    type: "block",
                    link: "",
                    label: "Status",
                    content: (val.status) ? val.status : " - ",
                },
                // {
                //     link: "",
                //     type: "html",
                //     label: "Criteria",
                //     customStyles: customStyles,
                //     content: ('<div class="raIconContainer">View Criteria<i  class="fa fa-angle-right" [ngStyle]="cheveronStyle"></i></div>'),
                // },
                {
                    type: "html",
                    link: "",
                    label: "Download",
                    customStyles: customStyles,
                    content: ('<div class="raIconContainer">XLS</div>'),
                },
                {
                    type: "html",
                    link: "",
                    label: "Action",
                    customStyles: customStyles,
                    content: ('<div class="raIconContainer">Delete</div>'),
                },
            ]
        };
        return item;
    }

    onCreateReport(value) {
        this.reportTitle = value.title;
        this.reportActions.createReport(value);
    }
    getReportSummary(requestParams) {
        requestParams.filter = this.filter;
        requestParams.sort = this.sortBy;

        if (this.sortOrder === "Desc") {
            requestParams.sort = `-${this.sortBy}`;
        }

        this.reportActions.getReports(requestParams);
        this.addFilterTag();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        // console.log("viewportWidth:", this.viewportWidth)
        this.viewportWidth = event.target.innerWidth;
    }
    getTitle() {
        let title = '';
        if (this.reportRecordNotFound && this.reportSummary) {
            title = `0/${this.reportSummary.metadata.page.totalElements} Reports`;
        } else if (this.reportSummary) {
            title = `${this.reportSummary.metadata.page.totalElements}/${this.reportSummary.metadata.page.totalUnfilteredRecords} Reports`;
            //title = `${this.reportSummary.metadata.page.totalElements} Reports`;
        }
        return `${title}`;
    }

    applySort(sortOption) {
        this.sortBy = sortOption.sortBy;
        this.sortOrder = sortOption.sortOrder;
        const requestParams = { userId: this.taxId, pageNumber: 1, filter: this.filter, sort: this.sortBy, filterInProgress: true };
        this.getReportSummary(requestParams);
    }

    addFilterTag() {
        let currFilterTags = [];
        this.filter.forEach((filterOption, i) => {
            let labels = this.filter[i].label.split(",");

            labels.forEach((label, j) => {
                currFilterTags.push({
                    label: labels[j],
                    value: labels[j],
                    metadata: this.filter[i].option
                });
            });
        });

        this.filterTags = currFilterTags;
    }
    applyFilter(filterOption) {
        this.updateFilterState(filterOption, () => {
            this.clientSearch = undefined;
            const requestParams = { userId: this.taxId, pageNumber: 1, filter: this.filter, sort: this.sortBy, filterInProgress: true, filterErrorMsg: true };
            this.getReportSummary(requestParams);
        });
    }

    applySortAndFilter(selectedState) {
        this.sortBy = selectedState.sortBy || this.sortBy;
        this.sortOrder = selectedState.sortOrder || this.sortOrder;

        selectedState.value && this.applyFilter(selectedState);

        const requestParams = { userId: this.taxId, pageNumber: 1, filter: this.filter, sort: this.sortBy, filterInProgress: true };
        !selectedState.value && this.getReportSummary(requestParams)
    }

    updateFilterState(newFilter, callback) {
        let filtersWithDupes = [...this.filter, newFilter];
        let filterDictionary = {};
        let filterArr = [];

        for (let i = 0; i < filtersWithDupes.length; i++) {
            let k = filtersWithDupes[i].option;
            let v = filtersWithDupes[i].value;
            let l = filtersWithDupes[i].label;
            if (k in filterDictionary) {
                if (filterDictionary[k].value.indexOf(v) === -1) {
                    filterDictionary[k].value += "," + v;
                    filterDictionary[k].label += "," + newFilter.label;
                }
            } else {
                filterDictionary[k] = {};
                filterDictionary[k].value = v;
                filterDictionary[k].label = l;
                filterDictionary[k].option = k;

            }
        }
        for (let key in filterDictionary) {
            filterArr.push({
                option: key,
                value: filterDictionary[key].value,
                label: filterDictionary[key].label
            });

        }

        this.filter = filterArr;
        callback()
    }
    onCloseTag(tag) {
        let indexInFilterArray = 0;
        let indexInFilterObjectArray = 0;
        let labels;

        for (let i = 0; i < this.filter.length; i++) {

            if (tag.metadata === this.filter[i].option) {
                indexInFilterArray = i;
                labels = this.filter[i].label.split(",");
                indexInFilterObjectArray = labels.indexOf(tag.label);
            }
        }

        let filtersArr = [...this.filter];
        let newLabelsArr = filtersArr[indexInFilterArray].label.split(",");
        let newValuesArr = filtersArr[indexInFilterArray].value.split(",");

        newLabelsArr.splice(indexInFilterObjectArray, 1);
        newValuesArr.splice(indexInFilterObjectArray, 1);

        filtersArr[indexInFilterArray].label = newLabelsArr.join(",");
        filtersArr[indexInFilterArray].value = newValuesArr.join(",");

        filtersArr = filtersArr.filter((filt) => {
            return filt.label.length !== 0 && filt.label !== undefined;
        });

        let currFilterTags = this.filterTags.filter((item) => {
            return item.label !== tag.label;
        });

        this.filterTags = currFilterTags;
        this.filter = filtersArr;

        const requestParams = { userId: this.taxId, pageNumber: 1, sort: this.sortBy, filterInProgress: true };
        this.getReportSummary(requestParams);
    }

    deleteReport(reportDetails, index) {
        const params = { id: reportDetails.rowDetails.id, name: reportDetails.rowDetails.title, type: reportDetails.rowDetails.reportType };
        this.deleteReportIndex = index;
        this.reportService.deleteReport(params.id)
            .subscribe(response => {
                this.messagingService.info(`Your ${params.type} report ${params.name} has been deleted`);
                const requestParams = { userId: this.taxId, pageNumber: 1 };
                this.getReportSummary(requestParams);
            })
    }

}
const filterConfig = {
    "filterItems": [
        {
            "label": "By Report Status",
            "value": "status",
            "type": "dropDown",
            "subList": [

                // {
                //     "label": "In Progress",
                //     "value": "In Progress"
                // },
                {
                    "label": "Completed",
                    "value": "Completed"
                },
                // {
                //     "label": "Submission in progress",
                //     "value": "Submission in progress"
                // },
                {
                    "label": "Failed",
                    "value": "Failed"
                }
            ]
        },
        {
            "label": "By Report Type",
            "value": "type",
            "type": "dropDown",
            "subList": [
                {
                    "label": "Renewals",
                    "value": "Renewals"
                },
                {
                    "label": "Clients",
                    "value": "Clients"
                }
            ]
        }
    ]
}
