import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, OnInit, DoCheck, Input, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { DOCUMENT } from "@angular/platform-browser";
import { IAppState } from '../Shared/store';
import * as moment from 'moment'
import { LoggedInUserInfo } from '../Shared/Interface/userProfile';
import { BpClientAppService } from './../BpClientApp/bpClientApp.service';
import { OnlineContentService } from './content.service';
import { MessagingService } from './../Shared/messaging/messagingService';
import { codeToState, lobMap } from './utilities';
import { ContentLoadingState } from './contentLoadingState.enum';
import { WindowUtils } from '../Shared/Providers/NativeWindow.service';
import { ResponseContentType } from "@angular/http";

@Component({
    selector: "bp-content",
    templateUrl: "./content.component.html",
    styleUrls: ['./content.component.css'],
})
export class OnlineContentComponent implements OnInit {
    loggedInUserInfo: LoggedInUserInfo;
    appointedStatesOptions: any;
    selectedState: string;
    selectedLob: string;
    defaultLob: any = { label: "Select a Market", value: "Select a Market" };
    lobs: any = { label: "Select a Market", value: "Select a Market" };

    landingPageState: any = {
        pageLoading: false,
        contentFetchFailed: false,
        noRecords: false,
        slotList: []
    };
    childPageState: any = {
        parent: {},
        current: {},
        contentFetchFailed: false,
        pageLoading: false
    };

    content: any = {};
    config: any;

    isInLandingPage: boolean = true;

    pageStack: any[] = [];

    constructor(public el: ElementRef,
        private zone: NgZone,
        private ngRedux: NgRedux<IAppState>,
        private route: ActivatedRoute,
        private appService: BpClientAppService,
        private contentService: OnlineContentService,
        private messagingService: MessagingService,
        private windowUtils: WindowUtils,
        private ref: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        // Subscribe to Config object
        this.ngRedux.select(['LoginReducer', 'config'])
            .subscribe((val: any) => {
                this.config = val.data;
            })

        // Subscribe to LoggedInUser object
        this.ngRedux.select(['LoginReducer', 'loggedInUserInfo'])
            .subscribe(val => {
                this.loggedInUserInfo = <LoggedInUserInfo>val;
                this.appointedStatesOptions = this.loggedInUserInfo.producer.appointedStates
                    .map(state => { return { label: codeToState[state], value: state } });
                this.lobs = this.loggedInUserInfo.producer.lineOfBusiness;
            });

        this.messagingService.clear();
        this.appService.SetPageTitle("Product Information");
    }

    onStateSelected(selectedStateOption) {
        this.selectedState = selectedStateOption.value;
        this.lobs = this.loggedInUserInfo.producer.lineOfBusiness[this.selectedState].map(lob => { return { label: lobMap[lob].display, value: lob } });

        this.resetContentPageState();
    }

    // If all the components are not reset, we may endup showing incorrect products ex: state CA -> landing page -> state CO (but no LOB changed) and querying documents of state CO
    private resetContentPageState() {
        this.selectedLob = "";
        this.landingPageState = {
            pageLoading: false,
            contentFetchFailed: false,
            noRecords: false,
            slotList: []
        };
        this.childPageState = {
            parent: {},
            current: {},
            contentFetchFailed: false,
            pageLoading: false
        };
        this.content = {};
        this.isInLandingPage = true;
        this.pageStack = [];

        this.ref.detectChanges();
    }

    onLobSelected(selectedLobOption) {
        if (selectedLobOption.value !== "Select a Market") {
            this.zone.run(() => {
                this.selectedLob = selectedLobOption.value;
                this.landingPageState.contentFetchFailed = this.landingPageState.noRecords = false;
                this.landingPageState.pageLoading = this.isInLandingPage = true;

                // reset slotList so that boxes doesn't show lingering product details
                this.landingPageState.slotList = [];

                // reset pageStack so that it will not eventually lead to navigational issues
                this.pageStack = [];
                this.ref.detectChanges();
            })

            this.contentService.FetchLandingPage(this.selectedState, this.selectedLob)
                .subscribe(response => {
                    this.zone.run(() => {
                        this.landingPageState.pageLoading = this.landingPageState.contentFetchFailed = false;
                        this.content = response;
                        if (this.content && this.content.pageSlotList && this.content.pageSlotList[0].wraSlotList.length === 0) {
                            this.landingPageState.noRecords = true;
                            this.landingPageState.slotList = [];
                        }
                        else {
                            this.landingPageState.slotList = this.content.pageSlotList[0].wraSlotList;
                            this.landingPageState.noRecords = false;
                            // set parents
                            this.landingPageState.slotList = this.landingPageState.slotList.map(child => {
                                child.parent = this.content.pageSlotList[0];
                                return child;
                            });
                        }
                        this.ref.detectChanges();
                    });
                }, err => {
                    this.zone.run(() => {
                        this.landingPageState.pageLoading = false;
                        this.landingPageState.contentFetchFailed = true;
                        this.ref.detectChanges();
                        this.messagingService.error("Unable to fetch content at the moment, please try again!!!");
                    });
                });
        }
    }

    onLinkSelection(selectedProduct) {
        this.isInLandingPage = this.childPageState.contentFetchFailed = false;
        this.childPageState.parent = selectedProduct.parent;
        this.childPageState.current = selectedProduct.item;
        this.childPageState.pageLoading = true;
        if (this.childPageState.current.ListAssoc === undefined) {
            this.contentService.FetchNode(this.childPageState.current.id, this.selectedState, this.selectedLob)
                .subscribe(response => {
                    this.childPageState.pageLoading = false;
                    this.childPageState.current = response;
                    this.childPageState.current.parent = selectedProduct.parent;
                    this.ref.detectChanges();
                    this.pageStack.push(selectedProduct.parent);
                }, err => {
                    this.childPageState.pageLoading = false;
                    this.childPageState.contentFetchFailed = true;
                    this.ref.detectChanges();
                })
        } else {
            this.childPageState.pageLoading = false;
            this.childPageState.current.parent = selectedProduct.parent;
            this.ref.detectChanges();
            this.pageStack.push(selectedProduct.parent);
        }
    }

    onDocumentSelection(selectedDocument) {
        this.contentService.FetchDocument(selectedDocument.damUpload)
            .subscribe((blob: any) => {
                try {
                    const fileName: string = `${selectedDocument.damLinkText}.${selectedDocument.damExtension}`;
                    this.windowUtils.downloadDocument(fileName, blob);
                } catch (err) {
                    this.messagingService.error("Failed parsing the document");
                }
            }, (error: any) => {
                this.messagingService.error("Failed parsing the document");
            })
    }

    goBackToPreviousContentPage() {
        // TODO: is current needed?
        this.zone.run(() => {
            let parentPage = this.pageStack.pop();
            if (this.pageStack.length === 0) {
                this.isInLandingPage = true;
            } else {
                this.childPageState.current = parentPage;
                this.childPageState.parent = parentPage.parent;
                this.ref.detectChanges();
            }
        });
    }
}