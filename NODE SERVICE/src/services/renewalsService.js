
import BaseService from "./baseService.js";

export default class RenewalsService extends BaseService {
    constructor() {
        super("service", undefined);
    }

    getSummary(queryParams) {
        return this.invokeGet("renewalsSummary", queryParams,token)
            .then(data => {
              return data;
            });
    }

    getDetails(hcid, renewalDate,token) {
      return this.invokePost("renewalsDetails",
      {"id":hcid, "renewalDate":renewalDate},token)
            .then(data => {
                return data;
            });
    }

    getSummaryDashboard(queryParams,token) {
        return this.invokeGet("renewalsSummaryDashboard", queryParams,token)
            .then(data => {
              return data;
            });
    }

    searchByName(queryParams,token) {
      return this.invokeGet("renewalsSearchByName", queryParams,token)
        .then(data => {
          return data;
        });
    }

    searchByClientId(queryParams) {
      return this.invokeGet("renewalsSearchByClientId", queryParams,token)
        .then(data => {
          return data;
        });
    }

    fetchRenewalsPdf(brokerFDocID,token) {
      return this.invokePipeGet("renewalsSummaryPdf", {brokerFDocID},token);
    }


//data formatting for Renewal Details- Renewal Tab


getrenDetFormattedData(renewalsData) {

  var renewalTransformedDetails = {
      client: {
          type: renewalsData.market,
          renewalLetter: {
              label: "Renewal Letter",
              endpoint: ""
          },
          aggregatedPremiums: [
              {
                  label: "Medical",
                  content: {
                      current: {
                          label: "Current",
                          content: "$"+Math.round(renewalsData.currentMedicalRate * 100) / 100
                      },
                      renewal: {
                          label: "Renewal",
                          content: "$"+Math.round(renewalsData.renewalMedicalRate * 100) / 100
                      },
                      increase: true
                  }
              },
              {
                  label: "Dental",
                  content: {
                      current: {
                          label: "Current",
                          content: ""
                      },
                      renewal: {
                          label: "Renewal",
                          content: ""
                      },
                      increase: true
                  }
              },
              {
                  label: "Vision",
                  content: {
                      current: {
                          label: "Current",
                          content: ""
                      },
                      renewal: {
                          label: "Renewal",
                          content: ""
                      },
                      increase: true
                  }
              },

          ],
          fields: [
              {
                  label: "Client ID",
                  content: ""
              },
              {
                  label: "Renewal Date",
                  content: ""
              },
              {
                  label: "Market",
                  content: ""
              },
              {
                  label: "State",
                  content: ""
              },
              {
                  label: "Products",
                  content: ""
              },
              {
                  label: "Exchange",
                  content: renewalsData.exchange
              },
              {
                  label: "Rating Area",
                  content:(renewalsData.medicalFutureRatingArea || renewalsData.medicalCurrentRatingArea || renewalsData.dentalFutureRatingArea || renewalsData.dentalCurrentRatingArea || renewalsData.pdFutureRatingArea || renewalsData.pdCurrentRatingArea)
              },
              {
                  label: "Association",
                  content: ""
              },
              {
                  label: "SIC",
                  content: ""
              },
              {
                  label: "Group Size",
                  content: renewalsData.size
              }
          ]
      },
      plans: ([]).concat(renewalsData.dentalProducts,
        renewalsData.visionProducts, renewalsData.medicalProducts).filter(function( element ) {
               return element !== undefined;
            })
        .map((val, ind)=>{
        return(
          {
              plan: {
                  heading: "Plan "+(ind+1),
                  columns: [
                      {
                          label: "",
                          content: ["Current", "Renewals"]
                      },
                      {
                          label: "Plan",
                          content: [val.currentProduct.currentContractPlanName, val.renewalProduct.currentContractPlanName]
                      },
                      {
                          label: "Contract Code",
                          content: [val.currentProduct.currentContractPlanCode, val.renewalProduct.currentContractPlanCode]
                      },
                      {
                          label: "Premium",
                          content: ["$"+Math.round(val.currentProduct.monthlyPremium * 100) / 100,
                                    "$"+Math.round(val.renewalProduct.monthlyPremium * 100) / 100]
                      },
                      {
                          label: "Subscribers",
                          content: [val.currentProduct.subscribers, val.renewalProduct.subscribers]
                      },
                      {
                          label: "Subsidy",
                          content: ["",""]
                      },
                      {
                          label: "Dependants Coverage",
                          content: ["",""]
                      }
                  ]
              },
              employees: {
                  heading: "Employees",
                  columns: [
                      {
                          label: "Employee",
                          content: val.employees.map((empVal,empInd)=>{
                            return((empVal.name).toLowerCase())
                          })
                      },
                      {
                          label: "Coverage",
                          content: val.employees.map((empVal,empInd)=>{
                            return(empVal.coverage)
                          })
                      },
                      {
                          label: "Age",
                          content: val.employees.map((empVal,empInd)=>{
                            return(empVal.age)
                          })
                      },
                      {
                          label: "Current Rate",
                          content: val.employees.map((empVal,empInd)=>{
                            return("$"+ Math.round(empVal.currentRate * 100) / 100)
                          })
                      },
                      {
                          label: "New Rate",
                          content: val.employees.map((empVal,empInd)=>{
                            return(empVal.newRate)
                          })
                      }
                  ]
              }
          }

         )
      }),

  };
  return renewalTransformedDetails;
}



}
