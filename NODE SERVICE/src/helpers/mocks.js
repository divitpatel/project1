import Promise from 'bluebird';
import nodeFs from 'fs';
import PATH from 'path';

let fs = Promise.promisifyAll(nodeFs);

class mocks {
    sendCommissionsSummary(paidTin, req, res, next) {
        if (paidTin === "099999999N") {
            res.status(403);
            res.json({ error: "Unauthorized!!!" })
        }

        return fs.readFileAsync(PATH.join(__dirname, './../mocks/commissions/summary', paidTin + '.json'));
    }

    fetchCommissionStatementPdf(statementId) {
        console.log("mocks - sendCommissionStatementPdf");
        return fs.readFileAsync(PATH.join(__dirname, './../mocks/commissions/pdfs', statementId + '.pdf'));
    }

    fetchCommissionDetails(statementID, req, res, next) {
        return fs.readFileAsync(PATH.join(__dirname, './../mocks/commissions/details', statementID + '.json'));
    }
}

var mocksObj = mocksObj || new mocks();

module.exports = mocksObj;
