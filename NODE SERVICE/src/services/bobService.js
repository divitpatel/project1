
import BaseService from "./baseService.js";
import moment from 'moment';

export default class BobService extends BaseService {
    constructor() {
        super("soaService", { "apikey": "bobApikey" });
    }

    formatDate(date) { //formats date into MM-DD-YYYY format,can be used across BOB
        if (date != undefined) {
            let arr = date.split("-");
            let newDate = arr[1] + "/" + arr[2] + "/" + arr[0];
            return newDate;
        }
        else {
            return "";
        }

    }

    getFormattedData(bobData) {
        //handles manipulation of the data making the response Flat
        let transformedData = bobData.map((record, ind) => {
            let hasGroup = ('group' in record),
                clientType = record.writingBroker.type;

            try {
                let data = {
                    "clientStatus": (record.status) ? record.status.name : " ",
                    "clientID": (hasGroup) ? record.group.groupId : (record.member ? record.member.hcid : ""),
                    "clientName": record.group ?
                        record.group.groupName :
                        (record.member ? (record.member.personName) : ""),
                    "marketSegment": record.marketSegment.name, // small group, senior, individual
                    "state": record.state ? record.state.code : "",
                    "ACAandNonACA": (record.products) ? (record.products.map((val, indx) => {
                        return val.acaFlag;
                    })
                        .filter(function (val, indx, a) {
                            return a.indexOf(val) == indx;
                        }).indexOf("Y") !== -1 ? "Yes" : "No") : "",
                    "effectiveDate": this.formatDate(record.effectiveDt),
                    "originalEffectiveDate": this.formatDate(record.originalEffectiveDt),
                    "newBusinessIndicator": (record.newBusinessIndicator) ? (record.newBusinessIndicator === "Y" ? "Yes" : "No") : " ",
                    "cancellationDate": this.formatDate(record.cancellationDt), // available at client level when client status is inactive
                    "productType": (record.products) ? record.products.map((val, indx) => {
                        return val.planType.description;
                    })
                        .filter(function (val, indx, a) {
                            return a.indexOf(val) == indx;
                        })
                        .join(", ") : " ",
                    "planType": (record.products) ? record.products.map((val, ind) => {
                        return val.healthcareArgmtCd.code;
                    })
                        .filter(function (val, indx, b) {
                            return b.indexOf(val) == indx;
                        })
                        .join(",") : " ",
                    "writingAgent": this.returnAgentName(record, "writingBroker"),
                    "paidAgent": this.returnAgentName(record, "paidBroker"),
                    "parentAgent": this.returnAgentName(record, "parentBroker"),
                    "reportingAgent": record.reportingBroker ? this.returnAgentName(record, "reportingBroker") : undefined,
                    "familyID": record.familyId,
                    "groupSize": record.groupSize,
                    "latestBillStatus": record.billStatus,
                    "dueDate": this.formatDate(record.billDueDt),
                    "renewalDate": this.formatDate(record.renewalDt),
                    "writingAgentTin": (record.writingBroker) ? record.writingBroker.tin : "",
                    "parentTin": (record.parentBroker) ? record.parentBroker.tin : "",
                    "muid": record.member ? record.member.mbrUid : "",
                    "ssid": record.sourceSystemId ? record.sourceSystemId : "",
                    "groupId": record.group ? record.group.groupId : ""
                };
                return data;
            } catch (err) {
                console.error("WEIRD DATA", err);
                return { statusCode: 500 };
            }

        });
        return transformedData;
    }

    getUniqueProducts(products) {
        let productsWithDupes = products.map(product => product.productFamCd.name);
        return (Array.from(new Set(productsWithDupes))).join(", ");
    }

    getDependentInfoFormattedData(data) {
        let dependentInfoColumns = data.columns; // avoid mapping of columns while format data
        delete data.columns;
        const dependentTabData = {
            columns: [
                {
                    type: "block",
                    link: "",
                    label: "Dependent",
                    content: (data.member.length) ? data.member.map(dependent => {
                        return (dependent.dependentName.firstNm + " " + dependent.dependentName.lastNm).toLowerCase()
                    }) : []
                },
                {
                    type: "block",
                    link: "",
                    label: "Member ID",
                    content: (data.member.length) ? data.member.map(dependent => dependent.hcid) : []
                },
                {
                    type: "block",
                    link: "",
                    label: "Relationship",
                    content: (data.member.length) ? data.member.map(dependent => dependent.relationshipCd.description) : []
                },
                {
                    type: "block",
                    link: "",
                    label: "DOB & Age",
                    content: (data.member.length) ? data.member.map(dependent => (this.formatDate(dependent.dob) + ' (' + moment().diff(dependent.dob, 'years') + ' Years)')) : []
                },
                {
                    type: "block",
                    link: "",
                    label: "Product",
                    content: (data.member.length) ? data.member.map(dependent => {
                        return this.getUniqueProducts(dependent.product)
                     }) :[]
                },
                {
                    type: "block",
                    link: "",
                    label: "Status",
                    content: (data.member.length) ? data.member.map(dependent => dependent.product[0].statusCd.description) : []
                },
                {
                    type: "block",
                    link: "",
                    label: "Monthly Premium",
                    content: (data.member.length) ? data.member.map(dependent => (dependent.currentMbrMonthlyPremium ?  ("$" + dependent.currentMbrMonthlyPremium) : "-")) : []
                },
                {
                    type: "block",
                    link: "",
                    label: "Effective Date",
                    content: (data.member.length) ? data.member.map(dependent => (dependent.effectiveDt ? this.formatDate(dependent.effectiveDt): "-")) : []
                },
            ]

        };
        return dependentTabData;
    }

    getCoverageInfoFormattedData(data) {
        let coverageTabData = {
            columns: [
                {
                    type: "block",
                    link: "",
                    label: "Effective Date",
                    content: (data.effectiveDt) ? this.formatDate(data.effectiveDt) : " "
                },
                {
                    type: "block",
                    link: "",
                    label: "Renewal Month",
                    content: (data.eligibility.renewalDt) ? this.formatDate(data.eligibility.renewalDt) : " "
                },
                {
                    type: "block",
                    link: "",
                    label: "Original Effective Date",
                    content: (data.originaleffectiveDt) ? this.formatDate(data.originaleffectiveDt) : ""
                },
                {
                    type: "block",
                    link: "",
                    label: "Cancellation Date",
                    content: (data.terminationDt) ? this.formatDate(data.terminationDt) : ""
                },
                {
                    type: "block",
                    link: "",
                    label: "Total Premium",
                    content: (data.currentPremuim) ? "$" + data.currentPremuim : " "
                },
                {
                    type: "block",
                    link: "",
                    label: "Subsidy Eligible",
                    content: (data.subsidyEligible) ? "$" + data.subsidyEligible : " "
                },
                {
                    type: "block",
                    link: "",
                    label: "PCP Name",
                    content: (data.pcpName) ? data.pcpName : " "
                },
                {
                    type: "block",
                    link: "",
                    label: "Exhange",
                    content: (data.exchangeId.code) ? data.exchangeId.code : " "
                },
                {
                    type: "block",
                    link: "",
                    label: "Product",
                    content: (data.eligibility.coverage.productFamCd.description) ? data.eligibility.coverage.productFamCd.description : " "
                },
                {
                    type: "block",
                    link: "",
                    label: "Plan",
                    content: (data.eligibility.coverage.healthcareArgmtCd.code) ? data.eligibility.coverage.healthcareArgmtCd.code : " "
                },
                {
                    type: "block",
                    link: "",
                    label: "Plan Name",
                    content: (data.eligibility.coverage.planNm) ? data.eligibility.coverage.planNm : " "
                },
                {
                    type: "block",
                    link: "",
                    label: "Coverage Dates",
                    content: (data.eligibility.coverage.coverageEfftiveDt) ? this.formatDate(data.eligibility.coverage.coverageEfftiveDt) + " - " + this.formatDate(data.eligibility.coverage.coverageTerminationDt) : " "
                },
                {
                    type: "block",
                    link: "",
                    label: "Coverage Type",
                    content: (data.eligibility.coverage.coverageType.description) ? data.eligibility.coverage.coverageType.description : " "
                },
                {
                    type: "block",
                    link: "",
                    label: "Contract Code",
                    content: (data.eligibility.coverage.contractCd.code) ? data.eligibility.coverage.contractCd.code : " "
                },
                {
                    type: "block",
                    link: "",
                    label: "Premium",
                    content: (data.eligibility.coverage.currentSubAmt) ? "$" + data.eligibility.coverage.currentSubAmt : " "
                },
                {
                    type: "block",
                    link: "",
                    label: "Subsidy",
                    content: "$100"
                },
                {
                    type: "block",
                    link: "",
                    label: "Cancellation Reason",
                    content: "Non Payment of bills"
                },
                {
                    type: "block",
                    link: "",
                    label: "Risk Adjustment Factor",
                    content: (data.eligibility.riskAdjFactor) ? data.eligibility.riskAdjFactor : " "
                },
                {
                    type: "block",
                    link: "",
                    label: "ID Card Mailed Date",
                    content: (data.eligibility.idCardMailDt) ? this.formatDate(data.eligibility.idCardMailDt) : " "
                },
                {
                    type: "block",
                    link: "",
                    label: "Welcome Packet Initiated Date",
                    content: (data.eligibility.pckInitiateDt) ? this.formatDate(data.eligibility.pckInitiateDt) : " "
                }
            ]
        };
        return coverageTabData;
    }

    returnAgentName(record, brokerType) {
        //to handle all Agent Types operating at Agent/Company Level in BOB Response
        let clientType = record[brokerType].type;
        switch (clientType) {
            case "A":
                if (record[brokerType].personInfo && record[brokerType].personInfo.firstName && record[brokerType].personInfo.lastName) {
                    return record[brokerType].personInfo.firstName + " " + ((record[brokerType].personInfo.middleName) ? (record[brokerType].personInfo.middleName + " ") : "") + record[brokerType].personInfo.lastName
                }
                else {
                    return '';
                }
                break;
            case "C":
                return record[brokerType].companyName;
                break;
            default:
                return "Unknown"
                break;
        }
    }

    getSummary(queryParams,token) {
        return this.invokeGet("clientSummary", queryParams,token)
            .then(data => {
                // convert metadata properties to integer to keep in sync with commission services metadata format
                if(data){
                  Object.keys(data.metadata.page).forEach(prop => { data.metadata.page[prop] = parseInt(data.metadata.page[prop]) });
                  data.bookOfBusiness = this.getFormattedData(data.bookOfBusiness);
                }
                return data;
            });
    }


    getSummaryDetails(hcid, mbrUid,token) {
        return this.invokePost("clientDetails", { "hcid": hcid, "mbrUid": mbrUid },token)
            .then(data => {
                return data;
            });
    }

    getClientBillingInfo(hcid, mbrUid, sourceSystemId,token) {
        return this.invokePost("billingDetails", { "hcid": hcid, "mbrUid": mbrUid, "sourceSystemId": sourceSystemId },token)
            .then(data => {
                return data;
            });
    }

    getSGBillingInfo(groupId, sourceSystemId,token) {
        return this.invokePost("sgBillingDetails", { "groupId": groupId, "sourceSystemId": sourceSystemId },token)
            .then(data => {
                return data;
            });
    }

    getBillingHistory(hcid, mbrUid,token) {
        return this.invokePost("billingHistory", { "hcid": hcid, "mbrUid": mbrUid },token)
            .then(data => {
                return data.reverse().splice(0, 12);
            });
    }

    getSGBillingHistory(groupId, sourceSystemId,token) {
        return this.invokePost("sgBillingHistory", { "groupId": groupId, "sourceSystemId": sourceSystemId },token)
            .then(data => {
                return data;
            });
    }

    getGroupClientCoverageInfo(groupId, sourceSystemId,token) {
        return this.invokePost("groupCoverageDetails", {  "groupId": groupId, "sourceSystemId": sourceSystemId},token)
            .then(data => {
                return data;
            });
    }


    getClientCoverageInfo(mbrUid, sourceSystemId,token) {
        return this.invokePost("coverageDetails", { "mbrUid": mbrUid , "sourceSystemId": sourceSystemId},token)
            .then(data => {
                return data;
            });
    }


    getPreviousCoverageInfo(hcid, mbrUid, sourceSystemId,token) {
        return this.invokePost("previousCoverageDetails", { "hcid": hcid, "mbrUid": mbrUid, "sourceSystemId": sourceSystemId },token)
            .then(data => {
                return data;
            });
    }


    getPreviousGroupCoverageInfo(groupId, sourceSystemId,token) {
        return this.invokePost("previousGroupCoverageDetails", { "groupId": groupId, "sourceSystemId": sourceSystemId},token)
            .then(data => {
                return data;
            });
    }


    getDentalBenefitsInfo(contractCode) {
        return this.invokeGet("dentalBenefits", { "contractCode": contractCode },token)
            .then(data => {
                return data;
            });
    }

    getVisionBenefitsInfo(contractCode, asOfDt, token) {
        return this.invokeGet("visionBenefits", { "contractCode": contractCode, "asofdt": asOfDt },token)
            .then(data => {
                return data;
            });
    }

    getMedicalBenefitsInfo(contractCode,token) {
        return this.invokeGet("medicalBenefits", { "contractCode": contractCode },token)
            .then(data => {
                return data;
            });
    }

    getPharmacyBenefitsInfo(contractCode,token) {
        return this.invokeGet("pharmacyBenefits", { "contractCode": contractCode },token)
            .then(data => {
                return data;
            });
    }

    getClientDependentInfo(mbrUid,token) {
        return this.invokePost("dependentDetails", { "mbrUid": mbrUid },token)
        .then(data => {
            data = this.getDependentInfoFormattedData(data);
                return data;
            });
    }

    getClientGroupInfo(groupId, ssid,token) {
          return this.invokePost("groupInfo", { "groupId": groupId, "sourceSystemId": ssid },token)
          .then(data => {
                  return data;
            });
    }

    getEmployeeInfo(groupId,token) {
        return this.invokePost("employeeInfo", { "groupId": groupId},token)
            .then(data => {
                return data;
            });
    }
    getEmpDependentInfo(mbrUid, groupId, ssid,token) {
        return this.invokePost("dependentDetails", { "groupId": groupId, "mbrUid": mbrUid, "sourceSystemId": ssid },token)
            .then(data => {
                data = this.getDependentInfoFormattedData(data);
                return data;
            });
    }

    getEmpDemographicInfo(mbrUid, groupId,token) {
        return this.invokePost("clientDetails", { "groupId": groupId, "mbrUid": mbrUid },token)
            .then(data => {
                return data;
            });
    }

    getBobBillingSummary(queryParams, token) {
      return this.invokeGet("billingSummary", queryParams, token)
      .then(data => {
          return data;
      });
      }

    clientSearch(queryParams,token) {
        return this.invokeGet("clientSearch", queryParams,token)
            .then(data => {
                return data;
            })
    }

    getEmpCoverageInfo(mbrUid, groupId, ssid, token) {
          return this.invokePost("coverageDetails", { "groupId": groupId, "mbrUid": mbrUid, "sourceSystemId": ssid },token)
            .then(data => {
                return data;
            });
    }

    getEmpPreviousCoverageInfo(mbrUid, groupId, ssid,token) {
        return this.invokePost("previousCoverageDetails", { "groupId": groupId, "mbrUid": mbrUid, "sourceSystemId": ssid },token)
            .then(data => {
                return data;
            });
    }

}
