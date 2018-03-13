import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Http, Headers, Response } from '@angular/http';

@Injectable()
export class BpClientAppService {
    pageTitle: ReplaySubject<string> = new ReplaySubject(1);
    constructor() {}

    SetPageTitle(title:string): Observable<string>{
        this.pageTitle.next(title);
        return this.pageTitle;
    }
}