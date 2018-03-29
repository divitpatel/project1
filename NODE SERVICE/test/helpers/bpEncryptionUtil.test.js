require('babel-register')({
    presets: ["env"]
});
require('babel-polyfill');
const request = require('supertest');
const expect = require('chai').expect;
const process = require('process');
const bpEncryptionUtil = require("./../../src/helpers/bpEncryptionUtil");

describe('Encryption Util test', function () {
    it('Custom encrypt & decrypt test', function () {
        const text = "bpreimagine";
        const enc = new bpEncryptionUtil().encrypt(text);
        const dec = new bpEncryptionUtil().decrypt(enc);

        expect(dec).to.equal(text);
    })

    it('Decrypt with known PTB encrypted simulation id', function () {
        const encryptedSimulationId = "4rstzLzuvvzdmY_BdMZ40g";
        const decryptedSimulationId = "brokerATK34";
        const dec = new bpEncryptionUtil().decrypt(encryptedSimulationId);

        expect(dec).to.equal(decryptedSimulationId);
    })
})