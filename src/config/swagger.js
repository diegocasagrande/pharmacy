var Config = require('./env');

exports.swagger = function(app) {

    let swagger_option = {
        swaggerDefinition: {
            info: {
                description: 'Swagger',
                title: 'Teste',
                version: Config.Env.server.version,
            },
            host: Config.Env.server.host,
            basePath: '/api/',
            produces: [
                "application/json",
                "application/xml"
            ],
            schemes: [Config.Env.server.protocol],
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: "All applications must have a valid key for access the endpoints.",
                }
            }
        },
        basedir: Config.Env.server.path, // app absolute path
        files: ['./routes/**/*.js'] // Path to the API handle folder
    };


    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.setHeader("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
        //intercepts OPTIONS method
        if ('OPTIONS' === req.method) {
            //respond with 200
            res.send(200);
        } else {
            //move on
            next();
        }
    });

    const expressSwagger = require('express-swagger-generator')(app);
    expressSwagger(swagger_option);

};