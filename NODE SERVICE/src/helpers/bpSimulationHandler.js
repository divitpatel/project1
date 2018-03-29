import request from "request";
import reqpromise from "request-promise";
import uuidGenerator from "uuid/v1";
import encryptionUtil from './bpEncryptionUtil';
import bpConfig from './bpConfig';
import * as bpConstants from './bpConstants';

export default class BpSimulationHandler {
    constructor() {
        this.bpConfig = bpConfig;
        this.encryptionUtil = new encryptionUtil();

        this.simulationInfoFound = false;
        this.simulationValue = "";
    }

    isSimulationSession(simulationUserId, doAsUserId) {
        return simulationUserId && doAsUserId;
    }

    isSimulationSessionActive(requestObj) {
        this.simulationInfoFound = requestObj.get(bpConstants.BP_SIMULATION_COOKIE) !== undefined;

        if (this.simulationInfoFound) {
            this.simulationValue = requestObj.get(bpConstants.BP_SIMULATION_COOKIE);
        }

        return this.simulationInfoFound;
    }

    getSimulationInfo(requestObj) {
        let simulationCookieValue = requestObj.get(bpConstants.BP_SIMULATION_COOKIE);
        let decryptedValues = this.encryptionUtil.decrypt(simulationCookieValue).split(':');

        return { simulationUserId: decryptedValues[0], doAsUserId: decryptedValues[1] };
    }

    buildSimulationInfo(simulationUserId, doAsUserId, responseObj) {
        const decrypted = this.encryptionUtil.decrypt(simulationUserId);
        this.populateSimulationInfo(decrypted, doAsUserId, responseObj);
    }

    decryptSimulationUserIdFromPTB(simulationUserId) {
        let url = this.bpConfig.getSetting("endPoints")["ptbServices"].PTB_DECRYPT_SIMULATIONID_URL;
        url = url.replace("{encryptedid}", simulationUserId);
        let uuid = uuidGenerator();
        let options = { url: url, rejectUnauthorized: false, json: true, headers: { "Authorization": this.bpConfig.getSetting("ptbAuthorizationHeader") } }

        return reqpromise(options)
            .then((data) => data.decrypted)
            .catch((errorInfo) => {
                console.log(uuid, ": Fetch unsuccessful. Error -", JSON.stringify(errorInfo));
                throw this.generateErrorToThrow(errorInfo);
            })
    }

    populateSimulationInfo(decryptedSimulationUserId, encryptedDoAsUserId, responseObj) {
        let cookieValue = this.encryptionUtil.encrypt(decryptedSimulationUserId + ":" + encryptedDoAsUserId);
        let options = {
            domain: ".anthem.com",
            httpOnly: true,
            secure: true
        };

        responseObj.header(bpConstants.BP_SIMULATION_COOKIE, cookieValue);
    }

    clearSimulationInfoInCookies(responseObj) {
        return responseObj.clearCookie(bpConstants.BP_SIMULATION_COOKIE);
    }

    clearSimulation(responseObj) {
        return responseObj.clearCookie(bpConstants.BP_SIMULATION_COOKIE);
    }
}