import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ILinkListItemModel } from './two-column-links.model';

@Component({
    selector: '[two-column-link-list]',
    templateUrl: './two-column-links.view.html',
    styleUrls: ['./two-column-links.styles.css']
})
export class TwoColumnLinksListComponent implements OnChanges {

    @Input() list1: ILinkListItemModel[];
    @Input() list2: ILinkListItemModel[];
    @Output() onLinkSelection: EventEmitter<any> = new EventEmitter();

    constructor() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
    }
    onLink(selectedItem) {
        this.onLinkSelection.emit(selectedItem);
    }
}