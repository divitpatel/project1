import CryptoJS from 'crypto-js';
import base64Url from 'base64-url';
import crypto from 'crypto';
import fs from 'fs';

const CryptoConfig = require('./../../config/cryptoConfig.json');

export default class EncryptionUtil {
    constructor(props) {
        this.salt = CryptoJS.enc.Utf8.parse(CryptoConfig.salt);
        this.iv = CryptoJS.enc.Utf16LE.parse(CryptoConfig.iv);
        this.key = CryptoJS.PBKDF2(CryptoConfig.pwd, CryptoConfig.salt, { keySize: CryptoConfig.keySize / 32, iterations: CryptoConfig.iterations });
        this.blockSize = CryptoConfig.blockSize;
    }

    encrypt(text) {
        try {
            // const cipher = crypto.createCipheriv('aes-128-cfb', key.toString(CryptoJS.enc.Utf8, iv.toString('binary')));
            // let enc = cipher.update(text, 'utf8', 'hex');
            // enc += cipher.final('hex');
            // enc = iv.toString('hex') + enc;

            // return enc;

            var textBytes = CryptoJS.enc.Utf8.parse(text);
            var cipherParams = CryptoJS.AES.encrypt(textBytes, this.key, {
                iv: this.iv, mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7, blockSize: this.blockSize
            });
            return base64Url.escape(CryptoJS.enc.Base64.stringify(cipherParams.ciphertext));
        } catch (error) {
            console.log(error);
        }
    }

    decrypt(text) {
        try {
            // const newIv = new Buffer(text.slice(0, 32), 'hex');
            // const decipher = crypto.createDecipheriv('aes-128-cfb', this.key.toString(CryptoJS.enc.Utf8), newIv.toString('binary'));
            // let recv = decipher.update(text.slice(32), 'hex', 'utf8');
            // recv += decipher.final('utf8');

            // return rec;

            var unescapedChiper = base64Url.unescape(text);
            var decrypted = CryptoJS.AES.decrypt(unescapedChiper, this.key, {
                iv: this.iv, mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7, blockSize: this.blockSize
            });

            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.log(error);
        }
    }
};
