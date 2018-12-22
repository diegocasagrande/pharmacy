"use strict";

class message extends Error {
    constructor(req) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'Message';
        if (req.code) this.code = req.code;
        if (req.message) this.message = req.message;
        if (req.extra) this.extra = req.extra;
        if (req.replaceMessage) this.replaceMessage = req.replaceMessage;
    }
};

module.exports = {
    message
};