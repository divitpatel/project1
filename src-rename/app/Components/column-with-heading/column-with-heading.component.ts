import { Component, OnInit, Input, DoCheck, Output, EventEmitter } from '@angular/core';
import {Http, Response,RequestOptions,RequestOptionsArgs,ResponseContentType} from '@angular/http';
import {saveAs as importedSaveAs} from "file-saver";
import { Router } from '@angular/router';

@Component({
    selector: 'column-with-heading',
    templateUrl: './column-with-heading.component.html',
    styleUrls: ['./column-with-heading.component.css']
})
export class ColumnWithHeadingComponent implements OnInit, DoCheck {
    @Input() styleOverrides;
    @Input() containerStyles;
    @Input() rows;
    @Input() heading;
    @Output() handleColumnClick: EventEmitter<any> = new EventEmitter<any>();
    defaultStyles = {
        heading: {
            fontSize: "14px",
            fontWeight: 600,
            color: "#848484",
        },
        row: {
            fontSize: "18px",
            fontWeight: 400,
            color: "#848484",
            padding: "0 15px 0 0",
        },
        container: {
            margin: 0,
            padding: "0 30px 0 0",
        }
    };
    styles = this.mergeDeep(this.defaultStyles, this.styleOverrides);
    lgSelectNm;

    constructor(private _router: Router,private http: Http) { }

    ngOnInit() {

    }

    ngDoCheck() {
    }
    isRowsArray(content: any) {
        return Array.isArray(content);
    }

    isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
    }

    mergeDeep(target, source) {
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            });
        }
        return target;
    }

  
    handleClick(){
    this.handleColumnClick.emit()
    }
}
