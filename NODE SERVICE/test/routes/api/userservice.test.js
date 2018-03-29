require('babel-register')({
    presets: ["env"]
});
require('babel-polyfill');
const request = require('supertest');
const expect = require('chai').expect;
const process = require('process');

describe('testing user services', function () {
    let server = require('./../../../src/server');

    it('User Profile - existing account', function (done) {
        request(server)
            .get('/apps/ptb/api/user/brokerATK34')
            .expect(200, function (err, res) {
                expect(res.body).to.have.nested.property('loggedInUserInfo');
                done();
            })
    })

    it('User Profile - non existing account', function (done) {
        request(server)
            .post('/apps/ptb/api/user/abcdefgh')
            .expect(404, done);
    })

    it('agent details', function (done) {
        request(server)
            .post('/apps/ptb/api//commissions/59a06ba73b113987653bd5f0/agentList')
            .expect(200, function (err, res) {
                expect(res.body).to.have.nested.property('productType');
                done();
            })
    })
})