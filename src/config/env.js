exports.Env = {
    server: {
        port: process.env.API_PORT,
        host: process.env.API_HOST,
        protocol: process.env.API_PROTOCOL,
        version: process.env.API_VERSION,
        path: process.env.PWD
    },
    db: {
        url: process.env.MONGO_URL,
        user: process.env.MONGO_USER,
        pwd: process.env.MONGO_PWD
    },
};