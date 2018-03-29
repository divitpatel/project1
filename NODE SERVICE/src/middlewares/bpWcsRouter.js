import express from 'express';
import fs from 'fs';
import PATH from 'path';
import cheerio from 'cheerio';
import bpConfig from './../helpers/bpConfig';
import bpBaseRouter from './bpBaseRouter.js';
import { bpConstants } from './../helpers/';
import contentService from './../services/contentService';
import _ from 'lodash';

export default class bpWcsRouter extends bpBaseRouter {
    constructor() {
        super();

        this.onlineContentService = new contentService();
    }

    initializeRoutes() {
        this.getRequestHandlers.push({ path: '/resources/landingpage/:state/:lineOfBusiness', handler: this.onlineContentLandingPage.bind(this) });
        this.getRequestHandlers.push({ path: '/resources/next', handler: this.onlineContentNextNode.bind(this) });
        this.getRequestHandlers.push({ path: '/resources/document', handler: this.getOnlineContentDocument.bind(this) })
    }

    onlineContentLandingPage(req, res, next) {
        const token = req.get("Authorization");
        const reqParmas = { state: req.params.state, lineOfBusiness: req.params.lineOfBusiness };
        this.onlineContentService.getOnlineContentLandingPage(reqParmas,token)
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    onlineContentNextNode(req, res, next) {
        const token = req.get("Authorization");
        const reqParmas = { assetUri: req.query.assetUri, state: req.query.state, lineOfBusiness: req.query.lineOfBusiness };
        this.onlineContentService.getOnlineContentNextPage(reqParmas,token)
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getOnlineContentDocument(req, res, next) {
        const token = req.get("Authorization");
        const reqParams = { assetUri: req.query.assetUri };
        this.onlineContentService.getDocument(reqParams,token)
            .on("error", (error) => {
                console.log(`Document download error - ${JSON.stringify(error)}`)
                error.message = "Unable to fetch document!!!";
                if (_.isUndefined(error.error) || ["ETIMEOUT", "ECONNREFUSED", "ENOTFOUND"].indexOf(error.error.code))
                    res.status(500).json({ code: "service_not_reachable", message: error.message });
                else
                    res.status(502).json({ code: "service_not_reachable", message: error.message });
            })
            .pipe(res);
    }

}