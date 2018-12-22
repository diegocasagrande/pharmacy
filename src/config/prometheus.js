var Prometheus = require('prom-client');
var ResponseTime = require('response-time');

var Register = require('prom-client').register;
var Counter = require('prom-client').Counter;
var Summary = require('prom-client').Summary;
var Gauge = require('prom-client').Gauge;

const collectDefaultMetrics = Prometheus.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'hobb_api_' });
collectDefaultMetrics({ timeout: 5000 });

function clearPath(path) {
    if (path.indexOf('api-docs') !== -1) {
        return '/others';
    }
    if (path.indexOf('/css') !== -1) {
        return '/others';
    }
    if (path.indexOf('health') !== -1) {
        return '/others';
    }
    if (path.indexOf('/info') !== -1) {
        return '/others';
    }
    if (path.indexOf('/vendor') !== -1) {
        return '/others';
    }
    if (path.indexOf('/favicon') !== -1) {
        return '/others';
    }
    if (path.indexOf('/swagger') !== -1) {
        return '/others';
    }
    if (path == '/') {
        return '/welcome';
    }
    return path;
}

/**
 * Health metrics for alert monitor
 */
module.exports.healthGauge = healthGauge = new Gauge({
    name: 'hobb_health_check',
    help: 'Health check API',
    labelNames: ['status', 'apiVersion']
});

/**
 * A Prometheus counter that counts the invocations of the different HTTP verbs
 * e.g. a GET and a POST call will be counted as 2 different calls
 */
module.exports.numOfRequests = numOfRequests = new Counter({
    name: 'hobb_numOfRequests',
    help: 'Number of requests made',
    labelNames: ['method', 'path']
});

/**
 * A Prometheus summary to record the HTTP method, path, response code and response time
 */
module.exports.responses = responses = new Summary({
    name: 'hobb_responses',
    help: 'Response time in millis',
    labelNames: ['method', 'path', 'status']
});

module.exports.responsesError = new Counter({
    name: 'hobb_responsesError',
    help: 'Response time in millis',
    labelNames: ['method', 'path', 'status', 'message']
});

/**
 * This funtion will start the collection of metrics and should be called from within in the main js file
 */
module.exports.startCollection = function() {
    // Logger.log(Logger.LOG_INFO, `Starting the collection of metrics, the metrics are available on /metrics`);
    require('prom-client').collectDefaultMetrics();
};

/**
 * This function increments the counters that are executed on the request side of an invocation
 * Currently it increments the counters for numOfPaths and pathsTaken
 */
module.exports.requestCounters = function(req, res, next) {
    if (req.path != '/metrics') {
        numOfRequests.inc({ method: req.method, path: clearPath(req.path) });
    }
    next();
}

/**
 * This function increments the counters that are executed on the response side of an invocation
 * Currently it updates the responses summary
 */
module.exports.responseCounters = ResponseTime(function(req, res, time) {
    if (req.url != '/metrics') {
        responses.labels(req.method, clearPath(req.url), res.statusCode).observe(time);
    }
})

module.exports.responseCountersError = function(req, res) {
    responsesError.labels(req.method, clearPath(req.url), res.statusCode, res.error.error);
}

/**
 * In order to have Prometheus get the data from this app a specific URL is registered
 */
module.exports.injectMetricsRoute = function(App) {
    App.get('/metrics', (req, res) => {
        res.set('Content-Type', Register.contentType);
        res.end(Register.metrics());
    });
};