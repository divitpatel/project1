import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'sort',
    templateUrl: './sort.component.html',
    styleUrls: ['./sort.component.css']
})
export class SortComponent { 
    @Input() content;
    @Input() sortOrder;
    @Input() sortBy;
    @Input() displayText;
    @Output() onSort: EventEmitter<any> = new EventEmitter();
    @Output() onToggleSort: EventEmitter<any> = new EventEmitter();

    private sortItems;
    
    constructor() { }

    ngOnInit() {
        this.sortItems = this.content.sortItems;
    }

    applySort() {
        this.onSort.emit({sortOrder: this.sortOrder, sortBy: this.sortBy});
    }

    handleChange(sortOption) {
        this.sortBy = sortOption.value;
        this.applySort();
    }

    toggleSort() {
        this.sortOrder = this.sortOrder === "Desc" ? "Asec" : "Desc";
        this.applySort();
    }
}
