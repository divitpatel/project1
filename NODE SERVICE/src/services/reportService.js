
import BaseService from "./baseService.js";

export default class reportService extends BaseService {
    constructor() {
        super("service", undefined);
    }

    createReport(reportObj,token) {
        return this.invokePost("reportSubmit", reportObj,token)
            .then(data => {
                return data;
            });
    }

    getSummaryReports(queryParams,token) {
        return this.invokeGet("reportDetailList",  queryParams,token )
            .then(data => {
                return data;
            });
    }

    fetchReportsSummaryXls(id) {
        return this.invokePipeGet("reportsSummaryXls", { id });
    }

    deleteReport(id) {
        return this.invokeDelete("reportsSummaryXls", { id });
    }

}
