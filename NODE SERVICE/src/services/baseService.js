import bpConfig from "./../helpers/bpConfig";
import request from "request";
import reqpromise from "request-promise";
import uuidGenerator from "uuid/v1";
import console from './../helpers/bpConsole';
import _ from "lodash";
import path from 'path';
import fs from 'fs';
import URL from 'url';
import { bpConstants, bpServerLogger } from './../helpers/'

export default class BaseService {
    constructor(serviceType, headerSettings = {}) {
        switch (serviceType.toLowerCase()) {
            case "service": this.serviceEndpointConfigFn = bpConfig.getServiceEndpoint; break;
            case "soaservice": this.serviceEndpointConfigFn = bpConfig.getSoaServiceEndpoint; break;
            case "contentservices": this.serviceEndpointConfigFn = bpConfig.getContentServiceEndpoint; break;
            case "ptbservice": this.serviceEndpointConfigFn = bpConfig.getPtbServiceEndpoint; break;
        }

        this.headerSettings = {};

        if (Object.keys(headerSettings).length > 0) {
            Object.keys(headerSettings).forEach(key => { this.headerSettings[key] = bpConfig.getSetting(headerSettings[key]) });
        }

        this.buildUrl = this.buildUrl.bind(this);
        this.getParamsFromUrl = this.getParamsFromUrl.bind(this);
    }

    getParamsFromUrl(url) {
        let regex = /{\w*}/g;
        let m;
        let allParams = [];

        while ((m = regex.exec(url)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            m.forEach((match, groupIndex) => {
                allParams.push(match);
            })
        }

        return allParams;
    }

    buildUrl(endpoint, parameters) {
        let url = this.serviceEndpointConfigFn(endpoint);
        if (parameters === undefined) {
            return url;
        }
        let allParams = this.getParamsFromUrl(url);

        //Prepare the URL with values
        url = allParams.reduce((newUrl, param) => {
            let paramName = param.substring(1, param.length - 1);
            let val = parameters[paramName];

            if (val === undefined || val === "undefined") {
                // remove the parameter from url
                bpServerLogger.info("%s not passed from client in %s", paramName, encodeURIComponent(url));
                let indx = newUrl.indexOf(param);
                let prevIndx = newUrl.lastIndexOf('&', indx);
                if (prevIndx < 0)
                    prevIndx = newUrl.lastIndexOf('?', indx);
                if (prevIndx < 0) {
                    // Throw error as the required parameter in Route is missing
                    throw new Error(paramName + " not passed.");
                }

                let nxtIndx = newUrl.indexOf('&', indx + 1);
                if (nxtIndx < 0) nxtIndx = newUrl.length;
                newUrl = newUrl.substring(0, prevIndx) + newUrl.substring(nxtIndx);
            } else {
                while (newUrl.indexOf(param) >= 0)
                    newUrl = newUrl.replace(param, encodeURIComponent(val));

                delete parameters[paramName];
            }

            return newUrl;
        }, url);

        // add the additional parameters coming from UI
        url = Object.keys(parameters).reduce((newUrl, param) => {
            return newUrl + "&" + param + "=" + encodeURIComponent(parameters[param]);
        }, url);

        bpServerLogger.info('Returning URL: %s', encodeURIComponent(url));
        return url;
    }

    invokeGet(endpoint, parameters, headers, correlationId) {
        let url = "";

        try {
            url = this.buildUrl(endpoint, parameters);
        } catch (ex) {
            return new Promise((resolve, reject) => {
                bpServerLogger.error(ex.message);
                reject({ statusCode: 500, error: { code: "Invalid parameters", message: ex.message } })
            });
        }

        return this.invokeGetWithUrl(url, correlationId, headers);
    }

    invokeGetWithUrl(url, correlationId, headerToken) {
        let uuid = correlationId || uuidGenerator();
        bpServerLogger.info({ correlationId: uuid, message: "Fetching " + url });
        // set the correlationid
        this.headerSettings[bpConstants.BP_CORRELATION_ID] = uuid;
        this.headerSettings[bpConstants.BP_JWT_TOKEN] = headerToken;
        let options = {
            url: url,
            headers: this.headerSettings,
            rejectUnauthorized: false,
            json: true
        };
        return reqpromise(options)
            .then((data) => {
                bpServerLogger.info({ correlationId: uuid, message: "Fetch successful" });
                return data;
            })
            .catch((errorInfo) => {
                bpServerLogger.error({ correlationId: uuid, message: JSON.stringify(errorInfo) });
                throw this.generateErrorToThrow(errorInfo);
            });
    }

    invokeGetWithFallbackURLsArray(urlArr, correlationId, headerToken) {
        for(let i = 0; i < urlArr.length; i++) {
            let uuid = correlationId || uuidGenerator();
            bpServerLogger.info({ correlationId: uuid, message: "Fetching " + urlArr[i] });
            // set the correlationid
            this.headerSettings[bpConstants.BP_CORRELATION_ID] = uuid;
            this.headerSettings[bpConstants.BP_JWT_TOKEN] = headerToken;
            let options = {
                url: urlArr[i],
                headers: this.headerSettings,
                rejectUnauthorized: false,
                json: true
            };
            return reqpromise(options)
                .then((data) => {
                    bpServerLogger.info({ correlationId: uuid, message: "Fetch successful" });
                    return data;
                })
                .catch((errorInfo) => {
                    bpServerLogger.error({ correlationId: uuid, message: JSON.stringify(errorInfo) });
                    if(urlArr[i] = urlArr[urlArr.length -1])
                        throw this.generateErrorToThrow(errorInfo);
                });
        }
    }

    invokePost(endpoint, parameters, headerToken) {
        let url = "";
        try {
            url = this.buildUrl(endpoint);
        } catch (ex) {
            return new Promise((resolve, reject) => {
                bpServerLogger.error(ex.message);
                reject({ statusCode: 500, error: { code: "Invalid parameters", message: ex.message, statusCode: 500 } })
            });
        }

        this.headerSettings[bpConstants.BP_JWT_TOKEN] = headerToken;
        let uuid = uuidGenerator();
        let options = {
            method: 'POST',
            uri: url,
            body: parameters,
            headers: this.headerSettings,
            rejectUnauthorized: false,
            json: true
        };
        console.log("POST TO RETRIEVE:", options)
        return reqpromise(options)
            .then((data) => {
                bpServerLogger.info(JSON.stringify(data));
                return data;
            })
            .catch((errorInfo) => {
                bpServerLogger.error(JSON.stringify(errorInfo));
                throw this.generateErrorToThrow(errorInfo);
            })
    }

    invokeDelete(endpoint, parameters, headers) {
        let url = "";
        try {
            url = this.buildUrl(endpoint, parameters);
        } catch (ex) {
            return new Promise((resolve, reject) => {
                bpServerLogger.error(ex.message);
                reject({ statusCode: 500, error: { code: "Invalid parameters", message: ex.message, statusCode: 500 } })
            });
        }

        let options = {
            method: 'DELETE',
            uri: url,
            headers: this.headerSettings,
            rejectUnauthorized: false,
            json: true
        };

        return reqpromise(options)
            .then((data) => {
                bpServerLogger.info(JSON.stringify(data));
                return data;
            })
            .catch((errorInfo) => {
                bpServerLogger.error(JSON.stringify(errorInfo));
                throw this.generateErrorToThrow(errorInfo);
            })
    }


    generateErrorToThrow(errorInfo) {
        // default error to throw
        let errorToThrow = { statusCode: 500, error: { code: errorInfo.statusCode || "service_not_reachable", message: errorInfo.message || "Unable to fetch data!!!" } };
        try {
            if (errorInfo.statusCode) {
                errorToThrow.statusCode = errorInfo.statusCode;
                if (errorInfo.error) {
                    errorToThrow.error.code = errorInfo.statusCode || errorInfo.error.code || errorInfo.error.errorCode;
                    errorToThrow.error.message = errorInfo.error.message || errorInfo.error.errorMessage;
                }
            }
        } catch (ex) {
            bpServerLogger.error("Exception: %s", JSON.stringify(ex));
        } finally {
            bpServerLogger.info("Finally Throwing error", JSON.stringify(errorToThrow));
        }

        return errorToThrow;
    }

    invokePipeGetWithUrl(url,token) {
        // const thisURL = URL.parse(url);
        // // Add CA from hostname if url is secured
        // if (thisURL.protocol === "https:") {
        //     bpServerLogger.info("%s: Attaching certificate to consume commission document service %s", uuid, path.join(__dirname, './../certs/', (thisURL.hostname) + '.cer'));
        //     options.ca = fs.readFileSync(path.join(__dirname, './../certs/', (thisURL.hostname) + '.cer'), { ecoding: 'utf-8' });
        // }
        var options = {
            url: url,
            headers: {
              'Authorization': token
            }
          }

        return request.get(options);
    }

    invokePipeGet(endpoint, parameters, headers) {
        let url = this.buildUrl(endpoint, parameters)
        let uuid = uuidGenerator();

        return this.invokePipeGetWithUrl(url,headers);
    };
}
