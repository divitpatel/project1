import { Component, Input, Output, ViewChild, EventEmitter, OnInit, ViewContainerRef } from '@angular/core';
import { UxHelper } from '@anthem/uxd';
import { ModalComponent } from '@anthem/uxd';

@Component({
    selector: "sort-and-filter",
    templateUrl: "./sort-and-filter.component.html",
    styleUrls: ["./sort-and-filter.component.css"]
})
export class SortAndFilterComponent implements OnInit {
    @Input() sortBy;
    @Input() sortOrder;
    @Input() sortDisplayText;
    @Input() filterOptions;
    @Input() content;
    @Input() desktopView;
    @Input() searchResultArr;
    @Input() sortClassName;
    @Output() onFilter: EventEmitter<any> = new EventEmitter();
    @Output() onSort: EventEmitter<any> = new EventEmitter();
    @Output() onSortAndFilter: EventEmitter<any> = new EventEmitter();
    @Output() onSearch: EventEmitter<any> = new EventEmitter();
    private sortItems;
    private selectedFilter;
    private filterLabel;
    private filterValue;
    private tempSortOrder;
    private tempSortBy;

    @ViewChild('modalSortFilter') modalSortFilter: ModalComponent;
    modal = { id: "modalSortFilter" };

    constructor(private viewContainerRef: ViewContainerRef, private uxHelper: UxHelper) {
        uxHelper.setRootViewContainerRef(viewContainerRef);
    }

    ngOnInit() {
        this.sortItems = this.content.sortItems;
    }

    openModal() {
        this.modalSortFilter.show();
    }

    closeModal() {
        this.modalSortFilter.handleClose();
    }

    handleSort(sortOption) {
        this.tempSortBy = sortOption.sortBy;
        this.tempSortOrder = sortOption.sortOrder;
        this.desktopView && this.onSort.emit({
            sortOrder: this.tempSortOrder,
            sortBy: this.tempSortBy
        });
    }

    handleSortAndFilter() {
        this.onSortAndFilter.emit({
            option: this.selectedFilter,
            value: this.filterValue,
            label: this.filterLabel,
            sortBy: this.tempSortBy,
            sortOrder: this.tempSortOrder
        })
        this.resetState();
        this.closeModal();
    }

    handleSearch(value) {
        this.onSearch.emit(value);
    }

    resetState() {
        this.selectedFilter = undefined;
        this.filterValue = undefined;
        this.filterLabel = undefined;
        this.tempSortBy = undefined;
        this.tempSortOrder = undefined;
    }

    handleFilter(selectedOption) {
        this.selectedFilter = selectedOption.option;
        this.filterValue = selectedOption.value;
        this.filterLabel = selectedOption.label;
        this.desktopView && this.onFilter.emit({
            option: this.selectedFilter,
            value: this.filterValue,
            label: this.filterLabel
        })
        this.desktopView && this.resetState()

    }

}