import { Injectable } from "@angular/core";

const _nativeWindowFn = (): any => window;

@Injectable()
export class WindowUtils {
    constructor() { }

    get nativeWindowRef(): any {
        return _nativeWindowFn();
    }

    downloadDocument(fileName: string, blob: any): void {
        // create a download anchor tag
        let downloadLink = document.createElement('a');
        downloadLink.target = '_blank';
        downloadLink.download = fileName;

        if (this.nativeWindowRef.navigator.msSaveBlob) {
            // Browser is IE, hence hand over save behavior to IE
            this.nativeWindowRef.navigator.msSaveBlob(blob, fileName);
        }
        else {
            // Non IE Browser - hence simulate the download behavior
            // create an object URL from the Blob
            let URL = this.nativeWindowRef.URL || this.nativeWindowRef.webkitURL;
            let downloadUrl = URL.createObjectURL(blob);
            // set object URL as the anchor's href
            downloadLink.href = downloadUrl;
            // append the anchor to document body
            document.body.appendChild(downloadLink);
            // fire a click event on the anchor
            downloadLink.click();
            // cleanup: remove element and revoke object URL
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(downloadUrl);
        }
    }
}