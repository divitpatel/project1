import express from 'express';
import fs from 'fs';
import PATH from 'path';
import cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import bpConfig from './../helpers/bpConfig';
import bpBaseRouter from './bpBaseRouter.js';
import { bpConstants, bpSimulationHandler } from './../helpers/';

const bpSimulationHandlerObj = new bpSimulationHandler();

export default class bpPageRouter extends bpBaseRouter {
    constructor() {
        super();

        this.rootRouter = this.rootRouter.bind(this);
    }

    initializeRoutes() {
        this.getRequestHandlers.push({ path: '/*', handler: this.rootRouter });
    }

    rootRouter(req, res, next) {
        let fetchBpAppHtml = new Promise((resolve, reject) => {
            let file = PATH.join(__dirname, "../../../dist", "index.html");
            fs.readFile(file, (error, data) => {
                if (error) {
                    console.log("Unable to read app.html", error);
                    reject({ error: error });
                } else {
                    console.log("index.html fetched successfully.");

                    // Assign DTM Asset URL
                    let html = cheerio.load(data.toString());
                    html('#dtmAssetScript').attr('src', bpConfig.getSetting('dtmAssetUrl'));

                    // Add HOT module in LOCAL environment
                    if (bpConfig.getSetting("environment") === "LOCAL") {
                        const bdlVendor = html("#bdlVendor");
                        bdlVendor.before("<script src='hot.bundle.js'></script>");
                    }
                    resolve(html.html());
                }
            });
        })

        fetchBpAppHtml
            .then(htmlContent => {
                try {
                    if (bpSimulationHandlerObj.isSimulationSession(req.query.simulationUserId, req.query.doAsUserId)) {
                        bpSimulationHandlerObj.buildSimulationInfo(req.query.simulationUserId, req.query.doAsUserId, res);
                        htmlContent = htmlContent.replace("{ isSimulation }", true).replace("{simulationHeader}", res.get(bpConstants.BP_SIMULATION_COOKIE));
                        res.send(sanitizeHtml(htmlContent, { allowedTags: false, allowedAttributes: false }));
                    } else {
                        htmlContent = htmlContent.replace("{ isSimulation }", false);
                        bpSimulationHandlerObj.clearSimulation(res).send(sanitizeHtml(htmlContent, { allowedTags: false, allowedAttributes: false }));
                    }
                } catch (error) {
                    console.log("Failed processing simulation header:", error);
                }
            })
            .catch(errorInfo => {
                res.status(500).send({ code: 500, statusCode: 500, message: errorInfo });
            })
    }
}
