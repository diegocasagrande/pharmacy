"use strict";

var telegram = require("telegram-bot-api");
var Config = require('../config/env');
var customError = require('../errors/customErrors');
var Prometheus = require('../config/prometheus');
var request = require("request");
var mongoose = require("mongoose");

exports.welcome = function(req, res) {
    res.render("welcome", {
        messageSuccess: "",
        messageError: ""
    });
};

exports.info = function(req, res) {
    return res.json({
        info: {
            server: {
                port: process.env.API_PORT,
                host: process.env.API_HOST,
                protocol: process.env.API_PROTOCOL,
                version: process.env.API_VERSION,
            },
            db: {
                url: process.env.MONGO_URL,
                user: process.env.MONGO_USER,
            },
        }
    });


};

exports.health = async function(req, res, next) {

    try {
        var statusCodeUp = 500;
        var dbConnectionUp = false;
        var gtwClientUp = false;

        if (mongoose.connection.readyState === 1) {
            var dbConnectionUp = true;
        };

        var res1 = await externalClientService.gtwClientUp()
        if (res1) {
            gtwClientUp = true;
        };

        if ((dbConnectionUp) && (gtwClientUp)) {

            statusCodeUp = 200
            Prometheus.healthGauge.labels('DOWN', process.env.API_VERSION).set(0);
            Prometheus.healthGauge.labels('TIME', process.env.API_VERSION).set((new Date).getTime());
            Prometheus.healthGauge.labels('UP', process.env.API_VERSION).inc();
        } else {
            Prometheus.healthGauge.labels('UP', process.env.API_VERSION).set(0);
            Prometheus.healthGauge.labels('TIME', process.env.API_VERSION).set((new Date).getTime());
            Prometheus.healthGauge.labels('DOWN', process.env.API_VERSION).dec();
        }



        return res.status(statusCodeUp).json({
            name: "Projeto Farmacia Mila",
            version: Config.Env.server.version,
            dbConnectionStatus: dbConnectionUp,
            externalClientService: gtwClientUp
        });

    } catch (e) {
        next(new customError.message({ code: 2001, replaceMessage: "Erro ao verificar a aplicação." }));
    }

};

exports.errors = async function(req, res, next) {
    try {
        var messages = await getMessage();
        return res.status(200).json(
            messages
        );
    } catch (e) {
        next(new customError.message({ code: 2002, replaceMessage: "Erro ao recuperar as mensagens." }));
    };
}

exports.contact = async function(req, res, next) {
    try {

        console.log("Telegram: ", req.body);

        await botMessage(req.body);

        res.render("welcome", {
            messageSuccess: "Message sent by success!",
            messageError: ""
        });
    } catch (e) {
        res.render("welcome", {
            messageSuccess: "",
            messageError: "Could not send the telegram, try again soon!"
        });
    };
}

function getMessage() {
    return new Promise(function(resolve, reject) {
        let _header = {
            "content-type": "application/json",
            "Authorization": Config.Env.message.authorization
        };
        var _url = Config.Env.message.url + '/api/v0/message/';
        request.get({
            headers: _header,
            url: _url,
            strictSSL: false,
            timeout: 1500,
            json: true
        }, function(error, response, body) {
            if (error) {
                reject(error);
            } else if (response.statusCode !== 200) {
                reject(response.body.error);
            } else {
                resolve(response.body);
            };
        });
    });
};

async function botMessage(req) {

    try {
        var bot = new telegram({
            token: '751207015:AAGtPUk99_uYWJ6V-B5lZ_aJKyTxnP40Ye0',
            // polling: { timeout: 5000, interval: 0 }
        });

        // bot.getMe()
        //     .then(function(data) {
        //         console.log(data);
        //     })
        //     .catch(function(err) {
        //         console.log(err);
        //     });

        bot.sendMessage({
            chat_id: "-1001385371194",
            text: "Farmácia Mila: Contato do Site!\n\n (" + Config.Env.server.host + ")" +
                "\n" + "Nome: " + req.nameForm +
                "\n" + "Email: " + req.emailForm +
                "\n" + "Telefone: " + req.phoneForm +
                "\n" + "Mensagem: " + req.messageTx
        });


    } catch (e) {
        console.log(e.message)
    }

}