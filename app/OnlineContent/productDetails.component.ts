import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter, SimpleChange } from "@angular/core";

@Component({
    selector: 'product-details',
    templateUrl: './productDetails.component.html',
    styleUrls: ['./productDetails.component.css']
})
export class ProductDetailsComponent implements OnChanges {

    @Input() previousPage: any;
    @Input() currentPage: any;
    @Input() pageLoading: boolean;
    @Input() fetchFailed: boolean;

    @Output() prevPage: EventEmitter<any> = new EventEmitter();
    @Output() onSelection: EventEmitter<any> = new EventEmitter();
    @Output() onDocumentSelection: EventEmitter<any> = new EventEmitter();

    noContent: boolean;
    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.currentPage) {
            const content: any = changes.currentPage.currentValue;
            this.noContent = content.ListAssoc
                ? content.ListAssoc.filter(item => ["ui_sharedlib_c", "dam_document"].indexOf((item.type || "").toLowerCase()) > -1).length === 0
                : true;
        }
    }

    previousPageSelection(selectedItem) {
        this.prevPage.emit(selectedItem);
    }

    productSelection(item) {
        this.onSelection.emit(item);
    }

    onDocSelection(item) {
        this.onDocumentSelection.emit(item);
    }
}
