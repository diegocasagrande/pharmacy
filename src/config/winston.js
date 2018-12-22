var winston = require('winston'),
    Config = require('./env'),

    expressWinston = require('express-winston')

expressWinston.ignoredRoutes.push('/metrics');
expressWinston.requestWhitelist.push('body');


const { json, label, splat, combine, timestamp, printf } = winston.format;


const myFormatError = printf(({ timestamp, level, message, meta }) => {
    return `{"level":"${level}", "timestamp":"${timestamp}", "meta": ${meta? JSON.stringify(meta):''} }`;
});

const myFormat = printf(info => {
    return `{"level":"${info.level}", "timestamp":"${info.timestamp}", "message":"${info.message}", "meta":${info.meta? JSON.stringify(info.meta): ''}}`;
});

const myFormatLogger = printf(info => {
    return `{"level":"${info.level}", "timestamp":"${info.timestamp}", "label":"${info.label}", "meta":${info.meta? JSON.stringify(info.meta): ''}}`;
});

var options = {
    file: {
        level: 'info',
        filename: `${Config.Env.server.path}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'info',
        format: combine(
            json(),
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            myFormat
        )

    },
};

var optionsError = {
    file: {
        level: 'error',
        filename: `${Config.Env.server.path}/logs/app_error.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {

        level: 'error',
        format: combine(
            json(),
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            myFormatError
        ),
        handleExceptions: false
    },
};

var loggerOptionsError = {
    file: {
        filename: `${Config.Env.server.path}/logs/app_error.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {

        format: combine(
            json(),
            label({ label: 'External Call' }),
            timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            myFormatLogger
        ),
        handleExceptions: false
    },
};



var customlogger = expressWinston.logger({
    transports: [
        // new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ]

});

var errlogger = expressWinston.errorLogger({
    transports: [
        // new winston.transports.File(optionsError.file),
        new winston.transports.Console(optionsError.console)
    ],

    blacklistedMetaFields: ['trace', 'os', 'message', 'level', 'memoryUsage', 'date', 'process', 'memoryUsage']

});

var loggerExternal = winston.createLogger({
    transports: [
        // new winston.transports.File(optionsError.file),
        new winston.transports.Console(loggerOptionsError.console)
    ],

});

module.exports = { errlogger, customlogger, loggerExternal }