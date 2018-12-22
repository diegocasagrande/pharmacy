var Config = require('../config/env');
var mongoose = require("mongoose");

var Authorization = require("../models/authenticationModel");

exports.createDBConnection = function(app) {

    var dbUrl = Config.Env.db.url;
    var mongo_option = {
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE, // tries
        reconnectInterval: 1000, // ms seconds to retry
        auth: {
            authdb: Config.Env.db.pwd,
        },
        authSource: Config.Env.db.user,
        useNewUrlParser: true,
        pass: Config.Env.db.pwd,
        user: Config.Env.db.user
    };

    mongoose.Promise = global.Promise;
    mongoose.set("useCreateIndex", true);
    // mongoose.connect(dbUrl, mongo_option);

    var nConn = 1;
    var connectWithRetry = function() {
        return mongoose.connect(dbUrl, mongo_option, function(err) {
            if (err) {
                console.error("Failed to connect to mongo on startup - retrying in 5 sec", err);
            }
            nConn++;
            // console.log(">>> Attempted connect: " + nConn);
        });
    };

    // connect
    connectWithRetry();

    // When successfully connected
    mongoose.connection.on("connected", () => {
        console.log("    DB connected after " + nConn + " attempted.");
    });

    // When successfully reconnected
    mongoose.connection.on("reconnected", () => {
        console.log("    DB Connection: reconnected (" + nConn + " attempted)");
    });

    // If the connection throws an error
    mongoose.connection.on("error", (err) => {
        console.log("    DB Connection: error: " + err);
        setTimeout(connectWithRetry, 5000);
    });

    // When the connection is disconnected
    mongoose.connection.on("disconnected", () => {
        console.log("    DB Connection: disconnected");
        setTimeout(connectWithRetry, 5000);
    });
};