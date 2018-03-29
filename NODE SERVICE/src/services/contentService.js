
import BaseService from "./baseService.js";

export default class reportService extends BaseService {
    constructor() {
        super("contentServices", undefined);
    }

    getOnlineContentLandingPage(reqParams,token) {
        return this.invokeGet("onlineResources", reqParams,token).then(data => data);
    }

    getOnlineContentNextPage(reqParams,token) {
        const remoteUrl = this.serviceEndpointConfigFn("onlineResourcesNextNode");
        const finalUrl = `${remoteUrl}${reqParams.assetUri}?state=${reqParams.state}&lineOfBusiness=${reqParams.lineOfBusiness}`;
        console.log(`finalUrl - ${finalUrl}`);
        return this.invokeGetWithUrl(finalUrl,null,token).then(data => data);

    }

    getDocument(reqParams,token) {
        const remoteEndpoint = reqParams.assetUri[0] === "/" ? this.serviceEndpointConfigFn("baseEndpoint") : this.serviceEndpointConfigFn("onlineResourcesNextNode");
        const finalUrl = `${remoteEndpoint}${reqParams.assetUri}`;
       console.log(`finalUrl - ${finalUrl}`);
        return this.invokePipeGetWithUrl(finalUrl,token);

    }
}
