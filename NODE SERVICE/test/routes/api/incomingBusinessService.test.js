require('babel-register')({
    presets: ["env"]
});
require('babel-polyfill');
const request = require('supertest');
const expect = require('chai').expect;
const process = require('process');

describe('testing incoming business services', function () {
    let server = require('./../../../src/server');

    it('Incoming Summary - Non-Existing Tax id', function (done) {
        request(server)
            .get('/apps/ptb/api/incoming/MLMPGQJPTY/summary')
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

    it('Summary - existing tax id', function (done) {
        request(server)
            .get('/apps/ptb/api/incoming/BGPFNSJQRY/summary')
            .expect(200, function (err, res) {
                expect(res.body).to.have.nested.property('metadata');
                expect(res.body).to.have.nested.property('data');
                done();
            })
    })
})