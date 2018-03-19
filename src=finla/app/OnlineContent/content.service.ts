import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { Observable } from "rxjs/Observable";
import { Http, Response, Headers, ResponseContentType } from "@angular/http";
import { lobMap } from './utilities';
import mock from './mock.json';

@Injectable()
export class OnlineContentService {
    landingPageContent: ReplaySubject<any> = new ReplaySubject(1);
    wcsContent: any = {};

    constructor(private http: Http) {

    }

    FetchLandingPage(state: string, lineOfBusiness: string): Observable<any> {
        //https://ecm-mgmt.dev.va.internal.das/cs/broker_portal/online-resources?depth=5&lineOfBusiness=IND&state=CA
        //const wcsContentApi = `https://ecm-mgmt.dev.va.internal.das/cs/broker_portal/online-resources?depth=5&lineOfBusiness=${lineOfBusiness}&state=${state}`;
        const actualLob = lobMap[lineOfBusiness].forBackend;
        const wcsContentApi = `/apps/ptb/content/resources/landingpage/${state}/${actualLob}`;

        // this.landingPageContent.next(mock);
        // return Observable.of<any>(mock);
        return this.http.get(wcsContentApi, { headers: new Headers({ 'Content-Type': 'application/json' }) })
            .map((response: Response) => {
                this.landingPageContent.next(response);
                this.wcsContent = response.json();
                return response.json()
            })
            .catch((e: any) => {
                const errorMessage = e.status === 0
                    ? "Oops... something went wrong, please retry later !!"
                    : e.json().message;
                return Observable.throw(errorMessage)
            });
    }

    FetchDocument(assetUri: string): Observable<any> {
        const wcsNextContentApi = `/apps/ptb/content/resources/document?assetUri=${encodeURIComponent(assetUri)}`;
        return this.http.get(wcsNextContentApi, { responseType: ResponseContentType.Blob })
            .map((response: Response) => response.blob())
            .catch((e: Error) => Observable.throw(e));
    }

    FetchNode(id: string, state: string, lineOfBusiness: string): Observable<any> {
        const { parentNode, childIndex } = this.findNode(id);

        const actualLob = lobMap[lineOfBusiness].forBackend;
        const wcsNextContentApi = `/apps/ptb/content/resources/next?assetUri=${encodeURIComponent(parentNode[childIndex].assetUrl)}&state=${state}&lineOfBusiness=${actualLob}`;
        return this.http.get(wcsNextContentApi, { headers: new Headers({ 'Content-Type': 'application/json' }) })
            .map((response: Response) => {
                let respObj = response.json();
                parentNode[childIndex] = respObj;

                return respObj;
            })
            .catch((e: any) => {
                const errorMessage = e.status === 0
                    ? "Oops... something went wrong, please retry later !!"
                    : e.json().message;
                return Observable.throw(errorMessage)
            });
    }

    findNode(id): any {
        let parentNode = this.wcsContent.pageSlotList[0].wraSlotList;

        const internalFindNode = (parentNode, id) => {
            if (parentNode === undefined)
                return undefined;

            const childIndex = parentNode.findIndex(node => node.id === id);

            if (childIndex > -1)
                return { parentNode, childIndex };

            for (let i: number = 0; i < parentNode.length; i++) {
                const internalFetch = internalFindNode(parentNode[i].ListAssoc, id);
                if (internalFetch !== undefined)
                    return internalFetch;
            }
        }

        return internalFindNode(parentNode, id);
    }
}