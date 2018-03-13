import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, OnInit, Input, HostListener, Inject, ViewChild, ViewContainerRef } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { DOCUMENT } from "@angular/platform-browser";
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';


import { BillingActions } from './billing.actions';
import { IAppState } from '../Shared/store';
import { SortComponent } from '../Components/sort/sort.component';
import { BpClientAppService } from '../BpClientApp/bpClientApp.service';
import { MessagingService } from './../Shared/messaging/messagingService';
import { SafeHtml } from '@angular/platform-browser/src/security/dom_sanitization_service';

declare let $: any;

@Component({
    selector: "bp-billing",
    templateUrl: "./billing.component.html",
    styleUrls: ['./billing.component.css'],
})
export class BillingComponent implements OnInit {
    private filterOptions = filterConfig;
    private filter = [];
    private sortBy: string = "BillDate";
    private sortOrder;
    private sortDisplayText = "By Bill Date"
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

    content = {
        dropDown2: {
            title: '',
            options: [
                {
                    label: 'By Client Name',
                    value: 'ClientName'
                },
                {
                    label: 'By Client ID',
                    value: 'ClientId'
                },
                {
                    label: 'By Billing Status',
                    value: 'BillStatus'
                },
                {
                    label: 'By Market',
                    value: 'MarketSegment'
                },
                {
                    label: 'By Due Date',
                    value: 'DueDate'
                },
                {
                    label: 'By Bill Date',
                    value: 'BillDate'
                }
            ]
        },
    }

    private tabProps = {
        labels: ['Clients', 'Billing', 'Renewals'],
        activeTab: 1,
        colorSettings: {
            normal: "#0079c2",
            hover: "#00609A",
            active: "#0079c2",
            textColor: "#fff"
        },
        breakpoint: 649,
    };

    constructor(
        public el: ElementRef,
        private ngRedux: NgRedux<IAppState>,
        private route: ActivatedRoute,
        private billingActions: BillingActions,
        private appService: BpClientAppService,
        private messagingService: MessagingService,
        private _sanitizer: DomSanitizer
    ) {
        this.sortOrder = "Desc";
        this.viewportWidth = window.screen.width;
    }


    ngOnInit() {
        this.viewportWidth = window.screen.width;
        this.taxId = this.route.snapshot.params['taxId'];
        let nextPageParams = { userId: this.taxId, pageNumber: 1, sort: this.sortBy };
        this.getBillingSummary(nextPageParams);
        this.detachScrollHandler();
        this.ngRedux.select(['BillingReducer', 'billingSummary']).subscribe(val => this.summary = val);
        this.ngRedux.select(['BillingReducer', 'billingDemographic']).subscribe(val => this.demographicData = val);
        this.ngRedux.select(['BillingReducer', 'summaryLoading']).subscribe(val => this.isNextPageLoading = val);
        this.ngRedux.select(['BillingReducer', 'summaryLoadingFailed']).subscribe(val => this.summaryLoadingFailed = val);
        this.ngRedux.select(['BillingReducer', 'billingRecordNotFound']).subscribe(val => this.billingRecordNotFound = val);
        this.ngRedux.select(['BillingReducer', 'filterInProgress']).subscribe(val => this.filterInProgress = val);
        this.ngRedux.select(['BillingReducer', 'clientSearch']).subscribe(val => {
            if (val !== undefined) {
                this.clientSearch = val && Object.keys(val).map(i => val[i])
                    .map(item => {
                        item.clientName = item.clientName.toLowerCase();
                        return item;
                    });                
            } else
                this.clientSearch = null;    
        });

        this.messagingService.clear();
        this.appService.SetPageTitle("Book Of Business");
    }


    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.viewportWidth = event.target.innerWidth;
    }

    // viewTabContent(targetTab, tabIndex) {
    //   console.log('targetTab', targetTab)
    //   console.log('tabIndex', tabIndex)
    // }

    getTitle() {
        let title = '';
        if (this.billingRecordNotFound && this.summary)
            title = `0/${this.summary.metadata.page.totalUnfilteredRecords} Clients`
        else if (this.summary)
            title = `${this.summary.metadata.page.totalElements}/${this.summary.metadata.page.totalUnfilteredRecords} Clients`;

        return `${title}`;
    }

    getSafeHtml(htmlProperty): SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(htmlProperty);
    }

    getBillingSummary(requestParams) {
        requestParams.filter = this.filter;
        requestParams.sort = this.sortBy;

        if (this.sortOrder === "Desc") {
            requestParams.sort = `-${this.sortBy}`;
        }

        this.billingActions.fetchBillingSummary(requestParams);
        this.addFilterTag();
    }

    applySort(sortOption) {
        this.sortBy = sortOption.sortBy;
        this.sortOrder = sortOption.sortOrder;
        const requestParams = { userId: this.taxId, pageNumber: 1, filter: this.filter, sort: this.sortBy, filterInProgress: true };
        this.getBillingSummary(requestParams);
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
        let dateFilter = { BillDate: "Bill Date", DueDate: "Due Date" };

        if (Object.keys(dateFilter).indexOf(filterOption.option) !== -1) {
            let toDate;
            let fromDate;

            if (filterOption.value.indexOf("-") !== -1) {
                toDate = moment().format('YYYY-MM-DD');
                fromDate = moment().subtract(Math.abs(parseInt(filterOption.value, 10)), "days").format('YYYY-MM-DD');
            } else {
                toDate = moment().add(Math.abs(parseInt(filterOption.value, 10)), "days").format('YYYY-MM-DD');
                fromDate = moment().format('YYYY-MM-DD');
            }

            filterOption.value = fromDate + "~" + toDate;
            filterOption.label = dateFilter[filterOption.option] + " - " + filterOption.label;
        }
        
        if (filterOption.option === "clientName")
            filterOption.label = filterOption.label.toLowerCase();
        
        this.updateFilterState(filterOption, () => {
            this.clientSearch = undefined;
            const requestParams = { userId: this.taxId, pageNumber: 1, filter: this.filter, sort: this.sortBy, filterInProgress: true };
            this.getBillingSummary(requestParams);
        });
    }

    applySortAndFilter(selectedState) {
        this.sortBy = selectedState.sortBy || this.sortBy;
        this.sortOrder = selectedState.sortOrder || this.sortOrder;

        selectedState.value && this.applyFilter(selectedState);

        const requestParams = { userId: this.taxId, pageNumber: 1, filter: this.filter, sort: this.sortBy, filterInProgress: true };
        !selectedState.value && this.getBillingSummary(requestParams)
    }

    applySearch(searchValue) {
        let { searchBy, searchTerm } = searchValue;
        searchTerm = searchTerm.toUpperCase();
        const requestParams = { taxId: this.taxId, searchBy, searchTerm };

        this.billingActions.clientSearch(requestParams);
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
        this.getBillingSummary(requestParams);
    }

    expandToggleCallback(param) {
        if (param.isExpanded) {
            const marketSegment = param.rowData.marketSegment.name;
            let apiParams;
            if (marketSegment === 'Small Group')
                apiParams = { groupId: param.rowData.group.groupId, ssid: param.rowData.sourceSystemId, marketSegment: marketSegment }
            else
                apiParams = { clientID: param.rowData.member.hcid, muid: param.rowData.member.mbrUid, marketSegment: marketSegment }
            this.billingActions.fetchDemographicData(apiParams);
        }
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(event) {
        const componentPosition = this.el.nativeElement.offsetTop;
        const scrollPosition = window.pageYOffset;
        if (this.summary && (this.summary.metadata.page.number <= this.summary.metadata.page.totalPages))
            this.attachScrollHandler();
    }

    attachScrollHandler() {
        this.handleScroll(this);
    }

    detachScrollHandler() {
        document.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll(self) {
        if (!this.isNextPageLoading) {
            let currentPage = self.summary.metadata;
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
        const taxId = this.route.snapshot.params['taxId'];
        const nextPageParams = { userId: taxId, pageNumber: pageNumber };
        const lastRecords = parseInt(this.summary.metadata.page.number) * parseInt(this.summary.metadata.page.size);
        this.progressIndicatorMessage = lastRecords + " - " + (lastRecords + parseInt(this.summary.metadata.page.size)) + " " + "loading... ";
        this.getBillingSummary(nextPageParams);
    }


    renderBillingSummary(val) {
        const currentBillHtml: string = '<div class="raIconContainer">Current Bill<i  class="fa fa-angle-right" [ngStyle]="raIconStyle"></i></div>';

        const phoneNumber = this.demographicData ? (this.demographicData.telephone ? this.demographicData.telephone.telephoneNbr : "-") : "-";
        const email = this.demographicData ? (this.demographicData.email ? this.demographicData.email : "-") : "-";
        const clientName = (val.group) ? ((val.group.groupName)) : (val.member ? ((val.member.personName)) : "-");
        const clientId = (val.group) ? val.group.groupId : (val.member ? val.member.hcid : "-");
        const customStyles = {
            fontSize: "18px",
            fontWeight: 400,
            color: "#0079c2",
            padding: "0 15px 0 0",
        }
        const raIconStyle = { 'color': "#fe5e3c" }
        let item = {
            mainColumn: {
                type: "full-column",
                link: "",
                label: "",
                content: clientName ? clientName.toTitleCase() : "-",
            },
            columns: [
                {
                    type: "block",
                    link: "",
                    label: "Client ID",
                    content: clientId ? clientId : "-",
                },
                {
                    type: "block",
                    link: "",
                    label: "Billing Status",
                    content: (val.billStatus) ? val.billStatus.toTitleCase() : " - ",
                },
                {
                    link: "",
                    type: "block",
                    label: "Market",
                    content: (val.marketSegment) ? val.marketSegment.name : "-",
                },
                {
                    type: "block",
                    link: "",
                    label: "Amount Billed",
                    content: val.amountBilled ? parseFloat(val.amountBilled).toLocaleString('USD', { style: 'currency', currency: 'USD' }) : "-",
                },
                {
                    link: "",
                    type: "block",
                    label: "Due Date",
                    content: val.dueDt ? moment(val.dueDt, "YYYY-MM-DD").format('MM/DD/YYYY') : "-",
                },
                {
                    link: "",
                    type: "block",
                    label: "Amount Paid",
                    content: val.amountPaid ? parseFloat(val.amountPaid).toLocaleString('USD', { style: 'currency', currency: 'USD' }) : "-",
                },
                {
                    type: "block",
                    link: "",
                    label: "Outstanding Balance",
                    content: val.outstandingBal ? parseFloat(val.outstandingBal).toLocaleString('USD', { style: 'currency', currency: 'USD' }) : "-",
                },
                {
                    type: "block",
                    link: "",
                    label: "Bill Date",
                    content: val.billDt ? moment(val.billDt, "YYYY-MM-DD").format('MM/DD/YYYY') : " - ",
                },
                {
                    type: "block",
                    link: "",
                    label: "Paid Date",
                    content: val.paidDt ? moment(val.paidDt, "YYYY-MM-DD").format('MM/DD/YYYY') : "-",
                },
                {
                    type: "block",
                    link: "",
                    label: "Frequency",
                    content: val.frequency ? val.frequency.toTitleCase() : "-",
                },
                {
                    type: "block",
                    link: "",
                    label: "Payment Mode",
                    content: val.modeOfPayment ? val.modeOfPayment : "-",
                },
                {
                    type: "block",
                    link: "",
                    label: "Email",
                    content: email,
                },
                {
                    type: "block",
                    link: "",
                    label: "Phone Number",
                    content: phoneNumber,
                },
                {
                    type: "html",
                    link: "",
                    label: "View",
                    customStyles: customStyles,
                    content: this.getSafeHtml(currentBillHtml),
                }
            ]
        };


        (val.marketSegment.name === 'Small Group') &&
            item.columns.splice(item.columns.findIndex(col => col.label === "raIcon"), 0, {
                type: "block",
                link: "",
                label: "Billing Entity Number",
                content: val.entityNum ? val.entityNum : "-",
            });
        (val.marketSegment.name === 'Indvidual') &&
            item.columns.splice(item.columns.findIndex(col => col.label === "Payment Mode"), 0, {
                type: "block",
                link: "",
                label: "Subsidy",
                content: "-",
            });
        return item;
    }

    sortBillingSummary() {

    }


}


const filterConfig = {
    "filterItems": [
        {
            "label": "By Client Name",
            "value": "clientName",
            "type": "autoSuggest",
            "textStyle": "capitalize",
            "placeHolder": "Search by client name"
        },
        {
            "label": "By Client ID",
            "value": "clientId",
            "type": "autoSuggest",
            "textStyle": "uppercase",
            "placeHolder": "Search by client ID"
        },
        {
            "label": "By Bill Status",
            "value": "BillStatus",
            "type": "dropDown",
            "subList": [
                {
                    "label": "Open",
                    "value": "OPEN"
                },
                {
                    "label": "APTC cancel",
                    "value": "APTC CANCEL"
                },
                {
                    "label": "Paid in full",
                    "value": "PAID IN FULL"
                },
                {
                    "label": "Paid write off",
                    "value": "PAID WRITE OFF"
                },
                {
                    "label": "Paid partial",
                    "value": "PAID PARTIAL"
                },
                {
                    "label": "Paid with tol",
                    "value": "PAID WITH TOL"
                },
                {
                    "label": "Zero dollar",
                    "value": "ZERO DOLLAR"
                }
            ]
        },
        {
            "label": "By Market",
            "value": "MarketSegment",
            "type": "dropDown",
            "subList": [
                {
                    "label": "Individual",
                    "value": "IND"
                },
                {
                    "label": "Medicare",
                    "value": "SNR"
                },
                {
                    "label": "Small Group",
                    "value": "SM"
                }
            ]
        },
        {
            "label": "By Due Date",
            "value": "DueDate",
            "type": "dropDown",
            "subList": [
                {
                    "label": "Last 30 days",
                    "value": "-30"
                },
                {
                    "label": "Last 60 days",
                    "value": "-60"
                },
                {
                    "label": "Next 30 days",
                    "value": "30"
                },
                {
                    "label": "Next 60 days",
                    "value": "60"
                },
                {
                    "label": "Custom date",
                    "value": "customDate"
                }
            ]
        },
        {
            "label": "By Bill Date",
            "value": "BillDate",
            "type": "dropDown",
            "subList": [
                {
                    "label": "Last 30 days",
                    "value": "-30"
                },
                {
                    "label": "Last 60 days",
                    "value": "-60"
                },
                {
                    "label": "Next 30 days",
                    "value": "30"
                },
                {
                    "label": "Next 60 days",
                    "value": "60"
                },
                {
                    "label": "Custom date",
                    "value": "customDate"
                }
            ]
        }
    ]
}