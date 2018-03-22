import { Component, OnInit, Input, DoCheck, Output, EventEmitter } from '@angular/core';
import {Http, Response,RequestOptions,RequestOptionsArgs,ResponseContentType} from '@angular/http';
import {saveAs as importedSaveAs} from "file-saver";
import { Router } from '@angular/router';


/**
 * Each instance of ColumnWithHeadingComponent represents a cell in
 * an expanding row (expanding-card component) with data in it, and sometimes
 * a label describing the data.
 */
 @Component({
    selector: 'column-with-heading',
    templateUrl: './column-with-heading.component.html',
    styleUrls: ['./column-with-heading.component.css']
})
export class ColumnWithHeadingComponent {
    @Input() styleOverrides: any;
    @Input() containerStyles: any;
    @Input() rows;
    @Input() heading;
    @Output() handleColumnClick: EventEmitter<any> = new EventEmitter<any>();

    private _defaultStyles: any = {
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

    public styles: any = this._mergeDeep(this._defaultStyles, this.styleOverrides);

    constructor() {}

    private _isRowsArray(content: any): boolean {
        return Array.isArray(content);
    }

    private _isObject(item): boolean {
        return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
    }

    private _mergeDeep(target, source) {
        if (this._isObject(target) && this._isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this._isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this._mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            });
        }
        return target;
    }

  
    handleClick(msg?: any){
        this.handleColumnClick.emit(msg);
    }
}
