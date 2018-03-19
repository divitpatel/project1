import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter } from "@angular/core";

@Component({
    selector: 'landing-page',
    templateUrl: './landingPage.component.html',
    styleUrls: ['./landingPage.component.css']
})
export class LandingPageComponent implements OnChanges {

    @Input() pageLoading: boolean;
    @Input() contentFetchFailed: boolean;
    @Input() noRecords: boolean;
    @Input() slotList: any;
    @Output() onSelection: EventEmitter<any> = new EventEmitter();
    @Output() onDocumentSelection: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnChanges() { }

    productSelection(item) {
        this.onSelection.emit(item);
    }

    onDocSelection(item) {
        this.onDocumentSelection.emit(item);
    }
}