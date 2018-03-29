require('babel-register')({
    presets: ["env"]
});
require('babel-polyfill');
const request = require('supertest');
const expect = require('chai').expect;
const process = require('process');

describe('testing commission services', function () {
    let server = require('./../../../src/server');

    it('Summary - non-existing tax id', function (done) {
        request(server)
            .get('/apps/ptb/api/commissions/MLMPGQJPTY')
            .expect({
                error:
                {
                    statusCode: 400,
                    error:
                    {
                        code: '400',
                        message: 'Looks like the data you have submitted has issues'
                    }
                }
            }, done);
    })

    it('Summary - existing tax id - 2017', function (done) {
        request(server)
            .get('/apps/ptb/api/commissions/BGPFNSJQRY?statementFromDate=01/01/2017&statementToDate=12/31/2017&sortBy=-statementDate')
            .expect(200, function (err, res) {
                expect(res.body).to.have.nested.property('metadata');
                expect(res.body).to.have.nested.property('data');
                done();
            })
    })

    it('Summary - existing tax id - 2016', function (done) {
        request(server)
            .get('/apps/ptb/api/commissions/BGPFNSJQRY?statementFromDate=01/01/2016&statementToDate=12/31/2016&sortBy=-statementDate')
            .expect(200, function (err, res) {
                expect(res.body).to.have.nested.property('metadata');
                expect(res.body).to.have.nested.property('data');
                done();
            })
    })

    it('Summary Sort by commissions earned', function (done) {
        request(server)
            .get('/apps/ptb/api/commissions/BGPFNSJQRY?statementFromDate=01/01/2016&statementToDate=12/31/2016&sortBy=-commissionsEarned')
            .expect(200, function (err, res) {
                expect(res.body).to.have.nested.property('metadata');
                expect(res.body).to.have.nested.property('data');
                done();
            })
    })

    it('Summary Insights - 2017', function (done) {
        request(server)
            .get('/apps/ptb/api/commissions/insight/BGPFNSJQRY/2017')
            .expect(200, function (err, res) {
                expect(res.body).to.have.nested.property('id');
                expect(res.body).to.have.nested.property('monthlyPaid');
                done();
            });
    })

    it('Summary Insights - 2016', function (done) {
        request(server)
            .get('/apps/ptb/api/commissions/insight/BGPFNSJQRY/2016')
            .expect(200, function (err, res) {
                expect(res.body).to.have.nested.property('id');
                expect(res.body).to.have.nested.property('monthlyPaid');
                done();
            });
    })

    it('Commission Details - existing', function (done) {
        request(server)
            .get('/apps/ptb/api/commissions/59a06ba73b113987653bd5f0/details')
            .expect(200, function (err, res) {
                expect(res.body).to.have.nested.property('paidTIN');
                done();
            });
    })

    it('Commission Details - Insights', function (done) {
        request(server)
            .get('/apps/ptb/api/commissions/details/insight/59a06ba73b113987653bd5f0')
            .expect(200, function (err, res) {
                expect(res.body).to.have.nested.property('commissionsByState');
                done();
            });
    })

    it('Commission Details - PDF', function (done) {
        request(server)
            .get('/apps/ptb/api/commissions/59a06ba73b113987653bd5f0/pdf')
            .expect(200, function (err, res) {
                expect(res.body).to.have.nested.property('commissionsByState');
                done();
            });
    })

    it('Commission Details - CSV', function (done) {
        request(server)
            .get('/apps/ptb/api/commissions/59a06ba73b113987653bd5f0/csv')
            .expect(200, function (err, res) {
                expect(res.body).to.have.nested.property('commissionsByState');
                done();
            });
    })
})