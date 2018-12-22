"use strict";
const Config = require('../config/env');
const Prometheus = require('../config/prometheus');
var request = require("request");

exports.errorHandling = async function(err, req, res, next) {

    console.log("err.code: ", err.code);
        if (!err.replaceMessage) {
            err.replaceMessage = "Falha de sistema.";
        };

        var errors = [{
            code: err.code,
            message: err.replaceMessage,
            errorCode: err.code,
            errorMessage: err.replaceMessage,
            extra: "Falha ao recuperar a mensagem.",
            type: "System"
        }]

        res.status(500).json({
            errors
        });

    //incrementa metrica para contar os erros tratados(Metrica definida no /utils/Prometheus.js)
    Prometheus.responsesError.inc({
        method: req.method,
        path: req.path,
        status: res.statusCode,
        message: errors[0].errorMessage
    })
};

// error alert prometheus
async function errorAlert(message) {
    if (message.alert) {
        TODO: "USAR O PROMETHEUS/GRAFANA PARA GERAR ALERTA"
        return true;
    }
    else {
        return false;
    }
};

// error alert prometheus
async function blockPassword(message) {
    if (message.blockPassword) {
        TODO: "Caso tenha 3 tentativas erradas bloqueia a senha"
        TODO: "Logon certo limpa tentativas"
        return true;
    }
    else {
        return false
    }
};
