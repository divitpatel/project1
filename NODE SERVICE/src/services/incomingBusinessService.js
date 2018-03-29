import BaseService from "./baseService.js";
import incomingBusinessConfig from "../../config/incomingBusinessConfig.json";

export default class IncomingBusinessService extends BaseService {
    constructor() {
        super("service", undefined);
    }
    //service to fetch the summary list

    getIncomingBusinessSummary(queryParams) {
        var incomingBusinessSummary = incomingBusinessConfig;
        console.log(queryParams);
        let pageNumber = parseInt(queryParams.pageNumber || '1');
        let pageSize = parseInt(queryParams.pageSize || '20');
        let startpoint = (pageNumber - 1) * pageSize;
        let endpoint = startpoint + pageSize;
        let updatedData = incomingBusinessSummary.applications.data.slice(startpoint, endpoint);
        const dataToSend = {
            metadata: {
                pages: { pageNumber, pageSize, totalElements: incomingBusinessSummary.applications.data.length,
                     totalPages: Math.ceil(incomingBusinessSummary.applications.data.length / pageSize) }
            },
            data: updatedData
        };

        console.log(queryParams, dataToSend.metadata, updatedData[0].name);
       
        return Promise.resolve(dataToSend);
    }
    
    /*getIncomingBusinessSummary(encryptedTaxId) {
        return this.invokeGet("applicationSummary",{encryptedTaxId})
            .then(data => {
              return data;
            });
    }*/
    //service to fetch the applicant's pdf
    fetchApplicationPdf(brokerFDocID,token) {
        return this.invokePipeGet("applicationSummaryPdf", { brokerFDocID },token);
    }
}