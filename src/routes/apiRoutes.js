"use strict";

var Prometheus = require("prom-client");
var customError = require('../errors/customErrors.js');
var authController = require("../controllers/authController")
var infoController = require("../controllers/infoController");


module.exports = function(app) {

    // Common Paths
    const URL_API = "/api";
    const VERSION = "/v0";

    // system info
    const PATH_METRICS = "/metrics";
    const PATH_CONTACT = "/contact";
    const PATH_INFO = "/info";

    // /metrics
    app.get(PATH_METRICS, (req, res) => {
        res.end(Prometheus.register.metrics());
    });

    // /welcome
    app.route("/").get(infoController.welcome);


    // /info
    app.route(PATH_INFO).get(infoController.info);

    // /contact - trata form contato
    app.route(PATH_CONTACT).post(infoController.contact);


    /**
     * This route will create a new authentication token for a owner
     * @route GET /token/{owner}
     * @group Authorization
     * @param {Authorization.model} owner.path.required - Owner
     * @returns {object} 200 - An json object with the owner auth data
     * @returns {Error}  403 - Business Error   
     * @returns {Error}  404 - Not Found Error
     * @returns {Error}  501 - Internal Server Error
     * @produces application/json
     * @consumes application/json
     */
    app.route(URL_API + VERSION + "/token/:owner").get(authController.getToken);

    // app.use(authController.verifyToken);

    // /favicon.ico ignore
    app.get('/favicon.ico', (req, res) => res.status(204));

    // return 404 not found
    app.all('*', function(req, res, next) {
        next(new customError.message({ code: 1001, replaceMessage: "Página não encontrada." }));
    });
};