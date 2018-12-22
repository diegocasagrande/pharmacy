'use strict';

const express = require('express');
const app = express();
var Config = require('./config/env');
var bodyParser = require('body-parser');
var Prometheus = require('./config/prometheus');
var winston = require('./config/winston');
var path = require('path');
var info = require('./controllers/infoController');

 

console.log('\nIniciando Pharmacy Api...  \n');
console.log('---   Variaveis consideradas  ---');
console.log('API_PORT  . . . . . . .: ' + Config.Env.server.port);
console.log('API_VERSION  .  . . . .: ' + Config.Env.server.version);
console.log('MONGO_URL . . . . . . .: ' + Config.Env.db.url);
console.log('MONGO_USER  . . . . . .: ' + Config.Env.db.user);
console.log('');
 

// var connection = require('./config/connectionFactory');
// connection.createDBConnection();

app.use(Prometheus.requestCounters);
app.use(Prometheus.responseCounters);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Definição do EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './public')));

// Swagger response
var swagger = require('./config/swagger').swagger(app);

// winston-express info logger - should be before routes
app.use(winston.customlogger)

var routes = require('./routes/apiRoutes');
routes(app);

// winston-express error logger - should be after router
app.use(winston.errlogger)

// Prometheus metrics for each route
Prometheus.injectMetricsRoute(app);
Prometheus.startCollection();

// Error handling middleware
var errors = require('./errors/errorHandling');
app.use(errors.errorHandling);

module.exports = app.listen(Config.Env.server.port);