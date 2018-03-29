require('babel-register')({
    presets: ["env"]
});
require('babel-polyfill');
const request = require('supertest');
const expect = require('chai').expect;
const process = require('process');

describe('testing util services', function () {
    let server = require('./../../../src/server');

    it('Client Configuration', function (done) {
        request(server)
            .get('/apps/ptb/api/config')
            .expect('Content-Type', 'applicaiton/json')
            .expect(200, function (err, res) {
                expect(res.body).to.have.nested.property('portalName');
                done();
            })
    })

    // it('Error Map', function (done) {
    //     request
    //         .post('/apps/ptb/api/errorMap')
    //         .expect(200, function (err, res) {
    //             console.log(res.body);
    //             expect(res.body).to.have.nested.property('authorizationError');
    //             done();
    //         });
    // })
})