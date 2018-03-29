import {bpClientLogger} from './../helpers';
import console from './../helpers/bpConsole';

export default function bpLogRouter(req, res, next) {
    console.log("Received log request", JSON.stringify(req.body.data));

    try {
        let logs = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body.data;
        logs.forEach(log => {
            log.clientAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            log.userAgent = req.headers["user-agent"];

            // Adding logs based on log4javascript supported logs from client side
            switch (log.level) {
                case "TRACE":
                case "DEBUG": bpClientLogger.debug(log); break;
                case "INFO": bpClientLogger.info(log); break;
                case "WARN": bpClientLogger.warn(log); break;
                case "ERROR":
                case "FATAL": bpClientLogger.error(log); break;
                default: bpClientLogger.info(log); break;
            }
        })
    } catch (error) {
        console.log("Failed to log... Reason:", JSON.stringify(error), "received log", JSON.stringify(req.body.data))
    }

    res.sendStatus(200);
}