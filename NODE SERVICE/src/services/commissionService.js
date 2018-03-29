import BaseService from "./baseService.js";

export default class CommissionsService extends BaseService {
    constructor() {
        super("service", undefined);
    }

    getSummary(encryptedTaxId, sortBy, statementFromDate, statementToDate, correlationId,token) {
        return this.invokeGet("commissionSummary", { paidTin: encryptedTaxId, sortBy, statementFromDate, statementToDate },token, correlationId)
    }

    getSummaryDashboard(encryptedTaxId, year, correlationId,token) {
        return this.invokeGet("commissionSummaryDashboard", { encryptedTaxId, year }, token,correlationId)
            .then(data => {
                // BPP-182: convert the format to [{month, commission}] format for reusing bar chart component AS-IS
                let totalMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                let response = [];
                // Add missing months in dashboard Data
                let existingMonths = Object.keys(data.monthlyPaid);
                totalMonths.forEach(month => {
                    if (existingMonths.filter(existingMonth => existingMonth === month).length === 0)
                        response.push({ month, commission: 0.0 });
                    else
                        response.push({ month, commission: data.monthlyPaid[month].commission });
                })

                data.monthlyPaid = response;

                return data;
            });
    }

    getStatementPdf(statementID, correlationId) {
        return this.invokeGet("commissionStatementPdf", { statementID }, correlationId);
    }

    getStatementXls(statementID, correlationId) {
        return this.invokeGet("commissionStatementXls", { statementID }, correlationId);
    }

    getAgentDetails(encryptedTaxId, paidTin, token) {
        return this.invokeGet("userAgentDetails", { encryptedTaxId, paidTin }, token)
    }

    getAgentList(statementId, fieldName, correlationId) {
        return this.invokeGet("agentsList", { statementId, fieldName }, correlationId)
    }

    getDetails(queryParams, token) {
        let statementId = queryParams.statementId;
        queryParams.pageNumber = queryParams.pageNumber || 1;
        queryParams.pageSize = queryParams.pageSize || 20;

        return this.invokeGet("commissionDetails", queryParams, token)
            .then(data => {
                data.data.forEach(item => {
                    // convert to policyOrGroupName to lower case to apply proper casing on UI
                    item.policyOrGroupName = (item.policyOrGroupName || "").toLowerCase();
                    item.producerName = (item.producerName || "").toLowerCase();
                })
                return data;
            });
    }

    getDetailsDashboard(statementId, correlationId,token) {
        return this.invokeGet("commissionDetailsDashboard", { statementId },token,correlationId);
    }

    getAllAgentsFromStatement(statementId, fieldName, token) {
        return this.invokeGet("agentsList", { statementId, fieldName }, token)
    }

    getPdfStatement(statementId, correlationId,token) {
        return this.invokePipeGet("commissionStatementPdf", { statementId },token, correlationId);
    }

    getCsvStatement(statementId, token) {
        return this.invokePipeGet("commissionStatementCsv", { statementId }, token);
    }
}
