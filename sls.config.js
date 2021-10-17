const slsw = require('serverless-webpack');

module.exports = {
    context: __dirname,
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    scriptPath: `${__dirname}/scripts`,
    servicesPath: `./services`,
    services: ['User', 'WebSockets'],
};
