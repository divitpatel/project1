import express from "express";
import compression from "compression";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import multer from "multer";
import https from "https";
import fs from "fs";
import PATH from "path";
import csurf from "csurf";
import process from "process";
import invalidCsrfToken from "./middlewares/InvalidCsrfToken.js";
import logo from './helpers/logo';
import { bpPageRouter, bpApiRouter, bpLogRouter, bpHealthRouter, bpWcsRouter } from './middlewares/';
import { bpConfig, bpConstants, bpSimulationHandler, bpServerLogger, bpClientLogger, bpEurekaClient, bpEncryptionUtil } from "./helpers/";
import helmet from 'helmet';
import expressStaticGzip from 'express-static-gzip';
import console from './helpers/bpConsole';
// Initialize global variables
const registerWithEureka = bpConfig.getSetting("eureka").register || false;

function applyCsrfToken() {
    var app = express();
    app.use(csurf({ cookie: true }))
}


class BrokerPortalApp {
    constructor() {
        this.serverListner = undefined;
        this.bpApiRouter = new bpApiRouter();
        this.bpPageRouter = new bpPageRouter();
        this.bpWcsRouter = new bpWcsRouter();
        this.app = express();
        this.config = bpConfig.getSetting;
        this.simulationHandler = new bpSimulationHandler();

        let payloadLimit = this.config("MS_payloadLimit");

        // configure helmet
        this.configureSecurity();
        this.app.use(this.globalErrorHandler.bind(this));
        this.app.use(this.corsMiddleware.bind(this));
        this.app.use(bodyparser.json({ limit: payloadLimit, type: ['json', 'application/csp-report'] }));
        this.app.use(bodyparser.urlencoded({ limit: payloadLimit, extended: true }));
        this.app.use(cookieParser());
        this.app.use(function (req, res, next) { // adding csrfToken seperately for each instance created above.
            applyCsrfToken();
            next();
        })
        this.app.use(compression());
        this.app.use(invalidCsrfToken);
    }

    configureSecurity() {
        // Disabling X-Powered-By header that gives attackers clue on the backend server info
        this.app.disable('x-powered-by');

        let scriptSources = ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'ajax.googleapis.com', "'unsafe-inline'", 'cdnjs.cloudflare.com', "'unsafe-inline'", 'assets.adobedtm.com', "'unsafe-inline'"];
        let styleSources = ["'self'", "'unsafe-inline'", 'maxcdn.bootstrapcdn.com', "'unsafe-inline'", 'cdnjs.cloudflare.com', "'unsafe-inline'"];
        let fontSources = ["'self'", 'maxcdn.bootstrapcdn.com', 'cdnjs.cloudflare.com'];
        let imgSources = ["'self'", '*.anthem.com'];

        // Not a best practice to proceed with unsafe-inline, however it is how webpack bundling works
        // and since we are only allowing trusted domains, it is still safe option
        // CATCH: IE is not compatible with CSP yet,
        // WORKAROUND: X-Framee-Options - DENY
        this.app.use(helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: scriptSources,
                styleSrc: styleSources,
                fontSrc: fontSources,
                imgSrc: imgSources
            },
            loose: false, // to detect common mistakes in directives configuration
            browserSniff: false // browser useragent sniffing
        }))

        this.app.use(helmet.xssFilter({ setOnOldIE: true }));
        this.app.use(helmet.frameguard({ action: 'sameorigin' }));
        this.app.use(helmet.noSniff());
        this.app.use(helmet.ieNoOpen());
        this.app.use(helmet.noCache());
    }

    globalErrorHandler(err, req, res, next) {
        bpServerLogger.debug("Global handler:", req.path);

        if (!err) {
            if (this.simulationHandler.isSimulationSessionActive(req)) {
                let simInfo = this.simulationHandler.getSimulationInfo(req);
                this.simulationHandler.populateSimulationInfo(simInfo.simulationUserId, simInfo.doAsUserId, res);
            }
            next();
        }

        bpServerLogger.debug("Global Error Handler: ", err);
    }

    corsMiddleware(req, res, next) {
        let corsHeaders = [
            { header: "Vary", value: "Origin" },
            { header: "Access-Control-Allow-Headers", value: "Origin, X-Requested-With, Content-Type, Accept" },
            { header: "Access-Control-Allow-Origin", value: this.config("accessingOrigin") }
        ];

        corsHeaders.forEach((keyVal) => {
            res.header(keyVal.header, keyVal.value);
        })

        next();
    }

    startRouters() {
        this.app.use(bpConstants.APP_CONTENT_CONTEXT, this.bpWcsRouter.router);
        bpServerLogger.debug(encodeURI(`Content API on ${this.url}${bpConstants.APP_CONTENT_CONTEXT}`));

        this.app.use(bpConstants.APP_API_CONTEXT, this.bpApiRouter.router);
        bpServerLogger.debug(encodeURI(`Api router on ${this.url}${bpConstants.APP_API_CONTEXT}`));

        this.app.use(bpConstants.APP_HEALTH_CONTEXT, bpHealthRouter);

        // Setup the static folders for images/stylesheets & bundles etc.
        const distFolder = PATH.join(__dirname, "..", this.config("staticFolders"));
        if (fs.existsSync(distFolder))
            this.app.use(bpConstants.APP_PAGE_CONTEXT, expressStaticGzip(distFolder, { enableBrotli: true }));
        else {
            console.error("**************DIST folder not found!!! Can't serve static assets, check!!!***********");
            process.abort();
        }

        this.app.use(bpConstants.APP_PAGE_CONTEXT, this.bpPageRouter.router);
        bpServerLogger.debug(encodeURI(`Page router on ${this.url}${bpConstants.APP_PAGE_CONTEXT}`));

        this.app.use(bpConstants.APP_LOGGER_CONTEXT, new multer().array(), bpLogRouter);
        bpServerLogger.debug(encodeURI(`Logger on ${this.url}${bpConstants.APP_LOGGER_CONTEXT}`));

        //this.debugRouter = express.Router();

        if (["LOCAL", "LOCAL-QA", "DEV"].indexOf(this.config("environment")) > -1) {
            // Skip SSL errors in lower environments
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        }

    }

    start() {
        bpServerLogger.debug("Is server running on HTTPS?", this.config("runOnHttps"));
        if (this.config("runOnHttps")) {
            const certFilePath = PATH.resolve(__dirname, '../../certs/', this.config("host") + ".pfx");
            this.serverListner = https.createServer({
                pfx: fs.readFileSync(certFilePath),
                passphrase: this.config("sslPassphrase")
            }, this.app)
        } else
            this.serverListner = this.app;

        this.serverListner.listen(this.config("port"), () => {
            this.url = (this.config("runOnHttps") ? "https" : "http") + "://" + this.config("host") + ':' + this.config("port");
            bpServerLogger.debug(logo());
            bpServerLogger.debug("Server started on ", this.url);
            this.startRouters();
        });

        if (registerWithEureka) {
            try {
                bpServerLogger.debug("Starting Eureka Client!!!");
                bpEurekaClient.start();
            } catch (err) {
                // This is temporary fix, ideally if Eureka registration fails, the application is technically not reachable in higher environments
                console.error(`Eureka registration failed, load balance configuration will not work!!!`);
            }
        }
    }

    stop() {
        if (registerWithEureka) {
            bpServerLogger.debug("Stopping Eureka client");
            bpEurekaClient.stop();
        }

        bpServerLogger.debug("Stopping server");
        this.serverListener && this.serverListner.stop(() => {
            bpServerLogger.debug("Closed all connections... exiting now");
            process.exit();
        });

        setTimeout(() => {
            bpServerLogger.debug("Looks like taking longer to close connections... exiting now");
            process.exit(-1);
        }, 10 * 1000);
    }
}
// Server initialization
let bpApp = new BrokerPortalApp();

// rejected promise handlers
process.on("unhandledRejection", (err) => {
    console.error('Unhandled Promise Rejection occurred: ', err);
    process.exit(1);
})
process.on("SIGINT", bpApp.stop);
process.on("SIGTERM", bpApp.stop);

bpApp.start();

module.exports = bpApp.app; // for Mocha tests
