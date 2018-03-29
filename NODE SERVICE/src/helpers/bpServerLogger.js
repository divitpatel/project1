var winston = require('winston');
import bpConfig from './bpConfig.js';
import PATH from 'path';
require('winston-daily-rotate-file');

const logFilePath = bpConfig.getSetting("serverLogFilePath") || './logs/serverlogs.log';
const tsFormat = () => (new Date()).toLocaleTimeString();

const options = {
    level: "debug",
    exitOnError: false,
    transports: [
        new (winston.transports.DailyRotateFile)({
            level: 'debug',
            filename: logFilePath,
            timestamp: tsFormat,
            handleExceptions: true,
            humanReadableUnhandledException: true,
            datePattern: 'MM-dd-yyyy.',
            prepend: true
        })
    ]
};

// Use Console transport only if it is not running in test context
!bpConfig.isInTestContext() && options.transports.push(new (winston.transports.Console)({ colorize: true }));

let logger = logger || new (winston.Logger)(options);

module.exports = logger;
