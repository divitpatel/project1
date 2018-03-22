import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { AfterViewChecked, AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: "search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.css"]
})
export class SearchComponent implements AfterViewInit {
    private searchValue: string;
    public listActive: boolean;
    public activateSearchIcon: boolean;
    @Input() searchResultArr: any;
    @Input() placeHolderText;
    @Input() selectedFilter;
    @Output() onSearch: EventEmitter<any> = new EventEmitter();
    @Output() onFilter: EventEmitter<any> = new EventEmitter();
    @Output() onCancelSearch: EventEmitter<any> = new EventEmitter();
    constructor() {
        this.searchResultArr = undefined;
        this.listActive = false;
        this.activateSearchIcon = false;
    }

    @ViewChild('search') private elementRef: ElementRef;
    ngAfterViewInit() {
        this.elementRef.nativeElement.focus();
    }

    ngOnChanges() {
        if (this.searchResultArr)
            this.listActive = true;
        else
            this.listActive = false;
    }


    toggleList() {
        this.listActive = !this.listActive;
    }

    handleChange(value) {
        this.searchValue = value;
        if (this.searchValue.length >= 3) {
            this.onSearch.emit(this.searchValue);
            this.activateSearchIcon = true;
            this.listActive = true
        } else {
            this.resetSearch()
        }
    }

    handleSearch(value) {
        const filterParams = {
            label: value,
            value: value
        }
        this.onFilter.emit(filterParams);
        this.resetSearch();
    }

    resetSearch() {
        this.searchResultArr = undefined;
        this.activateSearchIcon = false;
        this.listActive = false;
    }

    handleKeyPress(e) {
        if (e.key === 'Enter' && this.activateSearchIcon && this.searchResultArr) {
                this.handleFilter(this.searchResultArr[0]);
        }
    }

    handleClose() {
        this.resetSearch();
        this.onCancelSearch.emit();
    }

    handleFilter(selectedState) {
        this.listActive = false;
        const filterParams = {
            label: selectedState[this.selectedFilter.value],
            value: selectedState[this.selectedFilter.value]
        }
        this.onFilter.emit(filterParams);
        this.searchResultArr = undefined;
    }
}
