import BaseService from "./baseService.js";
import Promise from "bluebird";
import nodeFs from 'fs';
import path from "path";
import bpConfig from './../helpers/bpConfig';

let fs = Promise.promisifyAll(nodeFs);
const ROOT = "./..";

export default class UtilService extends BaseService {
    constructor() {
        super("service", { "Authorization": "authorizationHeader" });
    }

    getClientConfig() {
        return bpConfig.getSetting("clientConfig");
    }

    getErrorMap() {
        return fs.readFileAsync(path.resolve(__dirname, ROOT, "./../config/errors.json"));
    }
}