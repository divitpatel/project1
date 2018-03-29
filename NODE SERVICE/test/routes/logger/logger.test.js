require('babel-register')({
    presets: ["env"]
});
require('babel-polyfill');
const request = require('supertest');
const expect = require('chai').expect;
const process = require('process');

describe('testing logger', function () {
    let server = require('./../../../src/server');

    it('info logging', function (done) {
        request(server)
            .post('/apps/ptb/logger')
            .send({ data: [{ "logger": "clientlogs", "timestamp": 1503902973871, "level": "INFO", "url": "http://localhost:7071/apps/ptb/login", "message": "Initialized SPA routers" }] })
            .expect(200, done);
    })

    it('debug logging', function (done) {
        request(server)
            .post('/apps/ptb/logger')
            .send({ data: [{ "logger": "clientlogs", "timestamp": 1503902973871, "level": "DEBUG", "url": "http://localhost:7071/apps/ptb/login", "message": "Initialized SPA routers" }] })
            .expect(200, done);
    })

    it('trace logging', function (done) {
        request(server)
            .post('/apps/ptb/logger')
            .send({ data: [{ "logger": "clientlogs", "timestamp": 1503902973871, "level": "TRACE", "url": "http://localhost:7071/apps/ptb/login", "message": "Initialized SPA routers" }] })
            .expect(200, done);
    })

    it('error logging', function (done) {
        request(server)
            .post('/apps/ptb/logger')
            .send({ data: [{ "logger": "clientlogs", "timestamp": 1503902973871, "level": "ERROR", "url": "http://localhost:7071/apps/ptb/login", "message": "Initialized SPA routers" }] })
            .expect(200, done);
    })

    it('fatal logging', function (done) {
        request(server)
            .post('/apps/ptb/logger')
            .send({ data: [{ "logger": "clientlogs", "timestamp": 1503902973871, "level": "FATAL", "url": "http://localhost:7071/apps/ptb/login", "message": "Initialized SPA routers" }] })
            .expect(200, done);
    })
})