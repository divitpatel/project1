import { Component, Input, Output, OnInit, EventEmitter, OnChanges} from '@angular/core';


@Component({
    selector: "filter",
    templateUrl: "./filter.component.html",
    styleUrls: ["./filter.component.css"]
})

export class FilterComponent implements OnInit {
    @Input() filterOptions;
    @Input() searchResultArr;
    @Output() onFilter: EventEmitter<any> = new EventEmitter();
    @Output() onSearch: EventEmitter<any> = new EventEmitter();
    private listActive: boolean = false;
    private customDate: boolean = false;
    private listItems: Array<any>;
    private filterType: string;
    private selectedFilter: any = undefined;
    private customDateFilter: boolean = false;
    private searchEnabled: boolean = false;

    constructor() { }

    ngOnInit() {
        this.listItems = this.filterOptions.filterItems;
        // document.addEventListener('click', this.handleOutsideClick, false);
    }

    getDisplayText() {
        return (
            (this.selectedFilter && this.selectedFilter.label)
                ? `Filter ${this.selectedFilter.label}`
                : "Select Filter Option"
        );
    }

    handleChange(selectedState) {
        if (this.selectedFilter && this.selectedFilter.type === "dropDown" && !this.customDate) {
            //if selcted value is customDate set custome date to true otherwise applyFilter
            (selectedState.value === "customDate") ? this.customDate = true : this.applyFilter(selectedState)
        }
        else if (this.selectedFilter && this.selectedFilter.type === "dropDown" && this.customDate) {
            //TODO: handling custome date filter will go here;
        }
        else if (selectedState.type === "autoSuggest") {
            this.searchEnabled = true;
            this.selectedFilter = selectedState;
        }
        else {
            this.selectedFilter = selectedState;
            this.listItems = this.selectedFilter.subList
        }
    }

    handleSearch(searchTerm) {
        this.onSearch.emit({
            searchBy: this.selectedFilter.value,
            searchTerm
        })
    }

    applyFilter(filterParam) {
        this.onFilter.emit({
            option: this.selectedFilter.value,
            value: filterParam.value,
            label: filterParam.label
        });
        this.resetFilter();
        this.toggleList();
    }

    resetFilter() {
        this.selectedFilter = undefined;
        this.listItems = this.filterOptions.filterItems;
        this.searchEnabled = false;
    }

    toggleList() {
        this.listActive = !this.listActive;
    }

    handleOutsideClick() {
        if (this.listActive) {
            this.listActive = false;
            this.selectedFilter = undefined;
        }
    }

    handleCancelSearch() {
        this.searchEnabled = false;
        this.selectedFilter = undefined;
    }

    ngOnDestroy() {
        // document.removeEventListener('click', this.handleOutsideClick, false)
    }
}
