import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import console from './../helpers/bpConsole'
import bpConfig from './../helpers/bpConfig'

export default class bpBaseRouter {
    constructor() {
        this.router = express.Router();
        this.getRequestHandlers = [];
        this.postRequestHandlers = [];
        this.deleteRequestHandlers = [];

        this.initializeRoutes();
        this.startRoutes();
    }

    initializeRoutes() {

    }

    startRoutes() {
        // default method - empty - for subclasses to override
        this.getRequestHandlers.length > 0 && this.getRequestHandlers.forEach((val, index) => {
            this.router.get(val.path, [this.logRoute, val.handler]);
        });

        this.postRequestHandlers.length > 0 && this.postRequestHandlers.forEach((val, index) => {
            this.router.post(val.path, new multer().array(), [this.logRoute, val.handler]);
        });

        this.deleteRequestHandlers.length > 0 && this.deleteRequestHandlers.forEach((val, index) => {
            this.router.delete(val.path, [this.logRoute, val.handler]);
        });
    }

    router() {
        return this.router;
    }

    logRoute(req, res, next) {
        console.log(`log middleware - ${req.path}`);
        next();
    }
}
