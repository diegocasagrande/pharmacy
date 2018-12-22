"use strict";

//  Error Handler
var jwt = require("jsonwebtoken")

// MongoDB
var mongoose = require("mongoose");
var customError = require('../errors/customErrors');

exports.getToken = async function(req, res, next) {
    try {
        // console.log("Params: " + JSON.stringify(req.params));
        let owner = req.params.owner;
        let token = await jwt.sign({ owner }, 'supersecret');
        let auth = await authModel.create({
            owner: owner,
            token: token
        })
        res.json({
            data: auth
        });
    } catch (e) {
        if (e.code == 11000) {
            next(new customError.message({ code: 1021, replaceMessage: "Owner já possui um token." }));
        } else {
            next(new customError.message({ code: 1022, replaceMessage: "Falha ao criar o token." }));
        };
    };
};

exports.verifyToken = async function(req, res, next) {
    try {
        jwt.verify(req.headers.authorization, 'supersecret', function(err, decoded) {
            if (err) {
                next(new customError.message({ code: 1002, replaceMessage: "Autenticação fornecida não permite este procedimento." }));
            }
        });
        next();
    } catch (e) {
        next(e);
    }
};
