import BaseService from "./baseService.js";

export default class UserService extends BaseService {
    constructor() {
        super("service", { "Authorization": "authorizationHeader" });
    }

    getUserProfile(userid, token) {
        return this.invokeGet("userProfile", { userid }, token);
    }

    getAgentDetails(encryptedTaxId) {
        return this.invokeGet("userAgentDetails", { encryptedTaxId });
    }
}
