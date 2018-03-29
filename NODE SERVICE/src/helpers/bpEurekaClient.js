import eurekaJsClient from 'eureka-js-client';
import bpConfig from './bpConfig';
import * as networkUtils from './bpNetworkUtils';
import { bpServerLogger } from './index';

const config = bpConfig;
const eurekaConfig = bpConfig.getSetting("eureka");
const serverInfo = {
    instanceName: eurekaConfig.appName,
    hostName: networkUtils.getHostName(),
    ip: networkUtils.getIpAddress(),
    port: config.getSetting("port"),
    protocol: config.getSetting("runOnHttps") ? "https" : "http"
}
const client = new eurekaJsClient({
    requestMiddleware: (requestOpts, done) => {
        requestOpts.rejectUnauthorized = false;
        done(requestOpts);
    },
    instance: {
        instanceId: `${serverInfo.hostName}:${serverInfo.port}`,
        app: serverInfo.instanceName,
        hostName: serverInfo.hostName,
        ipAddr: serverInfo.ip,
        port: {
            '$': serverInfo.port,
            '@enabled': true
        },
        securePort: {
            '$': serverInfo.port,
            '@enabled': true
        },
        "vipAddress": serverInfo.instanceName,
        "secureVipAddress": serverInfo.instanceName,
        "statusPageUrl": `${serverInfo.protocol}://${serverInfo.hostName}:${serverInfo.port}/apps/ptb/info`,
        "healthCheckUrl": `${serverInfo.protocol}://${serverInfo.hostName}:${serverInfo.port}/apps/ptb/health`,
        "homePageUrl": `${serverInfo.protocol}://${serverInfo.hostName}:${serverInfo.port}/apps/ptb/api/`,
        "dataCenterInfo": {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            "name": 'MyOwn',
        },
    },
    "eureka": {
        serviceUrls: {
            default: eurekaConfig.serviceUrls
        },
        
        "preferIpAddress": true,
        "registerWithEureka": true
    },
});

client.logger.level('debug');

// client.on("started", () => {
//     bpServerLogger.debug("Eureka client started");
// })

// client.on("registered", () => {
//     bpServerLogger.debug("Eureka instance registered");
// })

// client.on("deregistered", () => {
//     bpServerLogger.debug("Eureka instance deregistered");
// });

// client.on("heartbeat", () => {
//     bpServerLogger.debug("Eureka client sent heartbeat request");
// });

// client.on("registryUpdated", () => {
//     bpServerLogger.debug("Eureka client updated registry");
// })

export default client;

