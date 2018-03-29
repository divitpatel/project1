import express from "express";
import request from "request";
import reqpromise from "request-promise";
import bodyparser from "body-parser";
import multer from "multer";
import _ from 'lodash';
import bpBaseRouter from "./bpBaseRouter.js";
import { incomingBusinessService, commissionService, bobService, renewalsService, userService, utilService, reportService, dbService } from "./../services/";
import bpSimulationHandler from './../helpers/bpSimulationHandler';
import * as bpConstants from './../helpers/bpConstants';

export default class bpApiRouter extends bpBaseRouter {
    constructor() {
        super();

        let upload = multer();
        this.router.use(bodyparser.urlencoded({ extended: true }));
        this.router.use(bodyparser.json());

        this.commissionServices = new commissionService();
        this.bobServices = new bobService();
        this.userServices = new userService();
        this.utilServices = new utilService();
        this.renewalsServices = new renewalsService();
        this.incomingBusinessServices = new incomingBusinessService();
        this.dbServices = new dbService();

        this.bpSimulationHandler = new bpSimulationHandler();
        this.reportService = new reportService();
    }
    initializeRoutes() {
        // initialize handlers
        // this is for GET handlers
        this.getRequestHandlers.push({ path: "/commissions/:encryptedTaxId", handler: this.getCommissionSummary.bind(this) });
        this.getRequestHandlers.push({ path: "/client/:encryptedTaxId", handler: this.getBoBSummary.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/:hcid", handler: this.getClientDetails.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/groupInfo/:groupId", handler: this.getClientGroupInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/billingInfo/:hcid", handler: this.getBillingInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/actual/billingInfo/:groupId", handler: this.getSGBillingInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/billingHistory/:hcid", handler: this.getBillingHistory.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/actual/billingHistory/:groupId", handler: this.getSGBillingHistory.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/dependentInfo/:mbrUid", handler: this.getDependentInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/coverage/current", handler: this.getCoverageInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/coverage/current/:groupId", handler: this.getGroupCoverageInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/previousCoverageInfo/:hcid", handler: this.getPreviousCoverageInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/groupCoverage/previous/:groupId", handler: this.getPreviousGroupCoverageInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/employeeInfo/:groupId", handler: this.getEmployeeInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/employeeInfo/dependentInfo/:mbrUid", handler: this.getEmpDepInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/employeeInfo/demographicInfo/:mbrUid", handler: this.getEmpDemographicInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/employeeInfo/CoverageInfo/:mbrUid", handler: this.getEmpCoverageInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/employeeInfo/previousCoverageInfo/:mbrUid", handler: this.getEmpPreviousCoverageInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/benefits/medical/:contractCode", handler: this.getMedicalBenefitsInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/benefits/vision/:contractCode", handler: this.getVisionBenefitsInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/benefits/dental/:contractCode", handler: this.getDentalBenefitsInfo.bind(this) });
        this.getRequestHandlers.push({ path: "/clientDetails/benefits/pharmacy/:contractCode", handler: this.getPharmacyBenefitsInfo.bind(this) });

        this.getRequestHandlers.push({ path: "/commissions/:statementId/details", handler: this.getCommissionDetails.bind(this) });
        this.getRequestHandlers.push({ path: "/commissions/:statementId/agentList", handler: this.getUserAgentList.bind(this) });
        this.getRequestHandlers.push({ path: "/commissions/:statementId/pdf", handler: this.getCommissionPdfStatement.bind(this) });
        this.getRequestHandlers.push({ path: "/commissions/:statementId/csv", handler: this.getCommissionCsvStatement.bind(this) });
        this.getRequestHandlers.push({ path: "/user/:userid", handler: this.getUserProfile.bind(this) });
        this.getRequestHandlers.push({ path: "/userProfile", handler: this.getUserProfileBySM.bind(this) });
        this.getRequestHandlers.push({ path: "/config", handler: this.getClientConfig.bind(this) });
        this.getRequestHandlers.push({ path: "/errorMap", handler: this.getErrorMap.bind(this) });
        this.getRequestHandlers.push({ path: "/commissions/insight/:encryptedTaxId/:year", handler: this.getCommissionSummaryInsights.bind(this) });
        this.getRequestHandlers.push({ path: "/commissions/details/insight/:statementId", handler: this.getCommissionDetailInsights.bind(this) });
        this.getRequestHandlers.push({ path: "/:encryptedTaxId/agent-codes", handler: this.getUserAgentDetails.bind(this) });
        this.getRequestHandlers.push({ path: "/commissions/detail/v1/:statementId", handler: this.getUserAgentList.bind(this) });
        this.getRequestHandlers.push({ path: "/bob/renewals/:encryptedTaxId", handler: this.getRenewalsSummary.bind(this) });
        this.getRequestHandlers.push({ path: "/bob/renewals/details/:hcid", handler: this.getRenewalsDetails.bind(this) });
        this.getRequestHandlers.push({ path: "/bob/renewals/insight/v1/:encryptedTaxId", handler: this.getRenewalsSummaryDashboard.bind(this) });
        this.getRequestHandlers.push({ path: "/bob/renewals/summary/v1/:encryptedTaxId/clientName", handler: this.searchRenewalsName.bind(this) });
        this.getRequestHandlers.push({ path: "/bob/renewals/summary/v1/:encryptedTaxId/clientID", handler: this.searchRenewalsByClientID.bind(this) });
        this.getRequestHandlers.push({ path: "/renewals/:brokerFDocID", handler: this.getRenewalsSummaryPdf.bind(this) });
        this.getRequestHandlers.push({ path: "/sm", handler: this.getUserProfileBySM.bind(this) });
        this.getRequestHandlers.push({ path: "/bob/billing/summary/:encryptedTaxId", handler: this.getBobBillingSummary.bind(this) });

        this.getRequestHandlers.push({ path: "/applications/summary/v1/:encryptedTaxId", handler: this.getIncomingBusinessSummary.bind(this) });
        this.getRequestHandlers.push({ path: "/applications/documents/v1/:brokerFDocID", handler: this.getApplicationSummaryPdf.bind(this) });
        this.getRequestHandlers.push({ path: "/reports/v1/:id", handler: this.getReportsSummaryXls.bind(this) });
        this.getRequestHandlers.push({ path: "/reports/summary/:id", handler: this.getSummaryReport.bind(this) });
        this.getRequestHandlers.push({ path: "/client/search/:encryptedTaxId", handler: this.clientSearch.bind(this) });

        this.getRequestHandlers.push({ path: "/login/getlogs", handler: this.getErrorLogs.bind(this)})

        // Post request handlers
        this.postRequestHandlers.push({ path: "/reports/create/:taxId", handler: this.createReport.bind(this) });
        this.postRequestHandlers.push({ path: "/refreshToken", handler: this.getJWTToken.bind(this) })

        // Delete request handlers
        this.deleteRequestHandlers.push({ path: "/reports/delete/:reportId", handler: this.deleteReport.bind(this) });
    }

    deleteReport(req, res, next) {
        this.reportService.deleteReport(req.params.reportId)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    clientSearch(req, res, next) {
        let token = req.get("Authorization");
        this.bobServices.clientSearch(Object.assign({}, req.params, req.query), token)
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    createReport(req, res, next) {
        let token = req.get("Authorization");
        this.reportService.createReport(req.body,token)
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getSummaryReport(req, res, next) {
        let token = req.get("Authorization");
        this.reportService.getSummaryReports(Object.assign({}, req.params, req.query),token)
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(error.statusCode || 500).json({error: error.error})
            })
    }

    getBobBillingSummary(req, res, next) {
        let token = req.get("Authorization");
        this.bobServices.getBobBillingSummary(Object.assign({}, req.params, req.query),token)
            .then((data) => {
              data ? res.json(data): res.status(204).json({message: "No Content"});
            })
          .catch((error) => {
              res.status(error.statusCode || 500).json({ error: error.error });
          })
    }
    getEmpCoverageInfo(req, res, next) {
        let token = req.get("Authorization");
        this.bobServices.getEmpCoverageInfo(
            req.params.mbrUid,
            req.query.groupId,
            req.query.ssid, token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }
    getEmpPreviousCoverageInfo(req, res, next) {
        let token = req.get("Authorization");
        this.bobServices.getEmpPreviousCoverageInfo(
            req.params.mbrUid,
            req.query.groupId,
            req.query.ssid, token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }
    getEmpDepInfo(req, res, next) {
        let token = req.get("Authorization");
        this.bobServices.getEmpDependentInfo(
            req.params.mbrUid,
            req.query.groupId,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }
    getEmpDemographicInfo(req, res, next) {
        let token = req.get("Authorization");
      this.bobServices.getEmpDemographicInfo(
          req.params.mbrUid,
          req.query.groupId,token)
          .then((data) => {
              res.json(data);
          })
          .catch((error) => {
              res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getEmpDepInfo(req, res, next) {
        let token = req.get("Authorization");
        this.bobServices.getEmpDependentInfo(
            req.params.mbrUid,
            req.query.groupId,
            req.query.ssid,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getEmployeeInfo(req, res, next) {
        let token = req.get("Authorization");
        this.bobServices.getEmployeeInfo(
            req.params.groupId,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getGroupCoverageInfo(req, res, next) {
        let token = req.get("Authorization");
        this.bobServices.getGroupClientCoverageInfo(
            req.params.groupId,
          req.query.sourceSystemId,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }
    getCoverageInfo(req, res, next) {
        let token = req.get("Authorization");
        this.bobServices.getClientCoverageInfo(
          req.query.mbrUid,
          req.query.sourceSystemId,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getPreviousCoverageInfo(req, res, next) {
        let token = req.get("Authorization");
        this.bobServices.getPreviousCoverageInfo(
            req.params.hcid,
            req.query.mbrUid,
            req.query.ssid, token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getPreviousGroupCoverageInfo(req, res, next) {
        let token = req.get("Authorization");
        this.bobServices.getPreviousGroupCoverageInfo(
            req.params.groupId,
          req.query.sourceSystemId,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getMedicalBenefitsInfo(req, res, next) {
        let token = req.get("Authorization");
        this.bobServices.getMedicalBenefitsInfo(
            req.params.contractCode,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getPharmacyBenefitsInfo(req, res, next) {
        let token = req.get("Authorization");
        this.bobServices.getPharmacyBenefitsInfo(
            req.params.contractCode,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getVisionBenefitsInfo(req, res, next) {
        const token = req.get("Authorization");
        this.bobServices.getVisionBenefitsInfo(
            req.params.contractCode,
            req.query.asOfDt,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getDentalBenefitsInfo(req, res, next) {
        const token = req.get("Authorization");
        this.bobServices.getDentalBenefitsInfo(
            req.params.contractCode,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getClientGroupInfo(req, res, next) {
        const token = req.get("Authorization");
        this.bobServices.getClientGroupInfo(
            req.params.groupId,
            req.query.ssid,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getDependentInfo(req, res, next) {
        const token = req.get("Authorization");
        this.bobServices.getClientDependentInfo(
            req.params.mbrUid,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getBillingInfo(req, res, next) {
        const token = req.get("Authorization");
        this.bobServices.getClientBillingInfo(
            req.params.hcid,
            req.query.mbrUid,
            req.query.sourceSystemId,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }
    getSGBillingInfo(req, res, next) {
        const token = req.get("Authorization");
        this.bobServices.getSGBillingInfo(
            req.params.groupId,
            req.query.sourceSystemId,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getBillingHistory(req, res, next) {
        const token = req.get("Authorization");
        this.bobServices.getBillingHistory(
            req.params.hcid,
            req.query.mbrUid,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getSGBillingHistory(req, res, next) {
        const token = req.get("Authorization");
        this.bobServices.getSGBillingHistory(
            req.params.groupId,
            req.query.sourceSystemId,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getClientDetails(req, res, next) {
        const token = req.get("Authorization");
        this.bobServices.getSummaryDetails(
            req.params.hcid,
            req.query.mbrUid,token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }


    getCommissionSummary(req, res, next) {
        const token = req.get("Authorization");
        this.commissionServices.getSummary(
            req.params.encryptedTaxId,
            req.query.sortBy,
            req.query.statementFromDate,
            req.query.statementToDate,
            req.get(bpConstants.BP_CORRELATION_ID),token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error });
            })
    }


    getBoBSummary(req, res, next) {
        const token = req.get("Authorization");
        this.bobServices.getSummary(Object.assign({}, req.params, req.query),token)
            .then((data) => {
                data ? res.json(data): res.status(204).json({message: "No Content"});
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getRenewalsSummary(req, res, next) {
        const token = req.get("Authorization");
        this.renewalsServices.getSummary(Object.assign({}, req.params, req.query),token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getRenewalsSummaryDashboard(req, res, next) {
        const token = req.get("Authorization");
        this.renewalsServices.getSummaryDashboard(Object.assign({}, req.params, req.query),token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            });
    }

    searchRenewalsName(req, res, next) {
        const token = req.get("Authorization");
        this.renewalsServices.searchByName(Object.assign({}, req.params, req.query),token)
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(error.statusCode || 500).json({ error: error.error });
            });
    }

    searchRenewalsByClientID(req, res, next) {
        const token = req.get("Authorization");
        this.renewalsServices.searchByClientId(Object.assign({}, req.params, req.query),token)
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(error.statusCode || 500).json({ error: error.error });
            });
    }

    getRenewalsSummaryPdf(req, res, next) {
        const token = req.get("Authorization");
        this.renewalsServices.fetchRenewalsPdf(req.params.brokerFDocID,token)
            .on("error", (error) => {
                error.message = "Hmmm...Something’s not right and we can't create a PDF";
                if (_.isUndefined(error.error) || ["ETIMEOUT", "ECONNREFUSED", "ENOTFOUND"].indexOf(error.error.code))
                    res.status(500).json({ code: "service_not_reachable", message: error.message });
                else
                    res.status(502).json({ code: "service_not_reachable", message: error.message });
            })
            .pipe(res);
    }


    getRenewalsDetails(req, res, next) {
        const token = req.get("Authorization");
        this.renewalsServices.getDetails(
            req.params.hcid,
            req.query.renewalDate,token
        )
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error: error.error });
            })
    }

    getCommissionSummaryInsights(req, res, next) {
        const token = req.get("Authorization");
        this.commissionServices.getSummaryDashboard(
            req.params.encryptedTaxId,
            req.params.year,
            req.get(bpConstants.BP_CORRELATION_ID),token)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error });
            })
    }

    getCommissionDetailInsights(req, res, next) {
        const token = req.get("Authorization");
        this.commissionServices.getDetailsDashboard(req.params.statementId,
            req.get(bpConstants.BP_CORRELATION_ID),token)
            .then((data) => { res.json(data); })
            .catch((error) => {
                res.status(error.statusCode || 500).json({ error });
            })
    }

    getCommissionDetails(req, res, next) {
        const token = req.get("Authorization");
        this.commissionServices.getDetails(Object.assign({}, req.params, req.query),token)
            .then((data) => { res.json(data); })
            .catch((error) => { res.status(error.statusCode || 500).json({ error }); })
    }

    getCommissionPdfStatement(req, res, next) {
        const token = req.get("Authorization");
        this.commissionServices.getPdfStatement(req.params.statementId,
            req.get(bpConstants.BP_CORRELATION_ID),token)
            .on("error", (error) => {
                error.message = CommissionSummaryErrors.commSummaryPDFStatementError;
                if (_.isUndefined(error.error) || ["ETIMEOUT", "ECONNREFUSED", "ENOTFOUND"].indexOf(error.error.code))
                    res.status(500).json({ code: "service_not_reachable", message: error.message });
                else
                    res.status(502).json({ code: "service_not_reachable", message: error.message });
            })
            .pipe(res);
    }

    getCommissionCsvStatement(req, res, next) {
        const token = req.get("Authorization");
        this.commissionServices.getCsvStatement(req.params.statementId,token)
            .on("error", (error) => {
                error.message = CommissionSummaryErrors.commSummaryExcelStatementError;
                if (_.isUndefined(error.error) || ["ETIMEOUT", "ECONNREFUSED", "ENOTFOUND"].indexOf(error.error.code))
                    res.status(500).json({ code: "service_not_reachable", message: error.message });
                else
                    res.status(502).json({ code: "service_not_reachable", message: error.message });
            })
            .pipe(res);
    }

    /* The below method can be invoked with two routes
    *  1. /apps/ptb/user/<userId> - invoked in non-SSO case
    *  2. /apps/ptb/userProfile - invoked in SSO case
    */
    getUserProfile(req, res, next) {
        let smuser = req.get("SM_USER");
        let smgroup = req.get("SM_GROUP");
        let tokenValue;
        this.postReqForJWTToken(smuser,smgroup)
        .then((token)=>{
            tokenValue = token;
            const tokenHeader = `Bearer ${tokenValue}`;
           return this.userServices.getUserProfile(req.params.userid,tokenHeader)
        })
        .then((data) => {
           let userProfileResponse = { loggedInUserInfo: data };
           userProfileResponse.jwtToken = tokenValue;
            res.json(userProfileResponse);
        })
        .catch((error) => {
             res.status(error.error.statusCode || 500).json({ error });
        })
    }

    postReqForJWTToken(smuser,smgroup) {
        let options = {
                method: 'POST',
                uri: 'http://va10dlvpos316.wellpoint.com:9000/api/token/secure',
                form: {
                    client_id: bpConstants.CLIENT_ID,
                    client_secret: bpConstants.CLIENT_SECRET
                },
                headers: {
                    SM_GROUP:smgroup,
                    SM_USER:smuser,
                },
                simple:false,
                json: true
            };

        return reqpromise(options)
            .then((token) => {
                return token;
            })
    }
    // Load both the simulation user profiler & logged in user profile
    getUserProfileBySM(req, res, next) {
        let loggedInUserId = req.get("SM_USER");

        if (loggedInUserId === undefined) {
            res.status(500).json({ error: { error: { code: "Invalid_SSO_Session", message: "No SSO details found in session!!!", statusCode: 500 } } });
        } else {
            // let groupInfo = req.get("SM_GROUP");
            // if (!bpConstants.BP_SM_GROUP_REGEX.test(groupInfo)) {
            //     res.status(403).json({ error: { error: { code: "Invalid_Simulation_Session", message: "Logged in user doesn't have privileges to simulate brokers!!!", statusCode: 403 } } });
            // } else {
            let isSimulation = this.bpSimulationHandler.isSimulationSessionActive(req);
            if (isSimulation)
                loggedInUserId = this.bpSimulationHandler.getSimulationInfo(req).simulationUserId;

            let tokenValue;
            this.postReqForJWTToken(loggedInUserId,req.get("SM_GROUP"))
            .then((token)=>{
               tokenValue = token;
               const tokenHeader = `Bearer ${tokenValue}`;
               return this.userServices.getUserProfile(loggedInUserId,tokenValue)
            })
            .then((data) => {
                let userProfileResponse = { loggedInUserInfo: data };
                userProfileResponse.jwtToken = tokenValue;
                if (isSimulation) {
                    let userRoles = req.get("SM_GROUP");
                    Object.keys(bpConstants.ROLE_TITLE_MAP).forEach((role) => {
                        if (userRoles.indexOf(role) > -1)
                           userProfileResponse.simulationInfo = { loggedInAs: bpConstants.ROLE_TITLE_MAP[role], isInternal: true };
                    })
                }

                res.json(userProfileResponse);
            })
            .catch((error) => { res.status(error.statusCode || 500).json({ error }); })
        }
    }

    getJWTToken(req,res,next) {
        this.postReqForJWTToken(req.get("SM_USER"),req.get("SM_GROUP"))
        .then((token) => {
            res.json(token);
        })
    }

    getClientConfig(req, res, next) {
        res.json(this.utilServices.getClientConfig());
    }

    getErrorMap(req, res, next) {
        this.utilServices.getErrorMap()
            .then(fileContent => {
                res.header("Content-Type", "application/json");
                res.send(fileContent);
            });
    }

    getUserAgentDetails(req, res, next) {
        const token = req.get("Authorization");
        this.commissionServices.getAgentDetails(req.params.encryptedTaxId, req.query.paidTin,token)
            .then(data => { res.json(data) })
            .catch(error => { res.status(error.statusCode || 500).json({ error }) });
    }

    getUserAgentList(req, res, next) {
        const token = req.get("Authorization");
        this.commissionServices.getAllAgentsFromStatement(req.params.statementId, req.query.fieldName,token)
            .then(data => { res.json(data) })
            .catch(error => { res.status(error.statusCode || 500).json({ error }) });
    }

    //Service calls for Applications
    getIncomingBusinessSummary(req, res, next) {
        const params = _.extend({}, req.parmas, req.query);
        this.incomingBusinessServices.getIncomingBusinessSummary(params)
            .then(data => { res.json(data) })
            .catch(error => { res.status(error.statusCode || 500).json({ error}) });
    }

    getApplicationSummaryPdf(req, res, next) {
        const token = req.get("Authorization");
        this.incomingBusinessServices.fetchApplicationPdf(req.params.brokerFDocID)
            .on("error", (error) => {
                error.message = "Hmmm...Something’s not right and we can't create a PDF";
                if (_.isUndefined(error.error) || ["ETIMEOUT", "ECONNREFUSED", "ENOTFOUND"].indexOf(error.error.code))
                    res.status(500).json({ code: "service_not_reachable", message: error.message });
                else
                    res.status(502).json({ code: "service_not_reachable", message: error.message });
            })
            .pipe(res);
    }

    getReportsSummaryXls(req, res, next){
      this.reportService.fetchReportsSummaryXls(req.params.id)
      .on("error", (error) => {
          error.message = "Hmmm...Something’s not right and we can't fetch the Excel";
          if (_.isUndefined(error.error) || ["ETIMEOUT", "ECONNREFUSED", "ENOTFOUND"].indexOf(error.error.code))
              res.status(500).json({ code: "service_not_reachable", message: error.message });
          else
              res.status(502).json({ code: "service_not_reachable", message: error.message });
      })
      .pipe(res);
    }

    getErrorLogs(req, res, next) {
        const dbquery = {}
        dbquery.limit = parseInt(req.query.pagesize);
        dbquery.skips = req.query.pagesize * (req.query.pagenum - 1);
        dbquery.condition = { $or: [ { "errorCode": req.query.searchparam }, { "username": req.query.searchparam }, {"emailAddress": req.query.searchparam}, {"enryptedTaxId" : req.query.searchparam} ] };
        this.dbServices.finddoc(dbquery)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(error.statusCode || 500).json({ error: 'mongodb error'});
        })
    }

}
