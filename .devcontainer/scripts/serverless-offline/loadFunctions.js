const fs = require("fs");
const yaml = require("yaml");
const config = require('../../../sls.config');

const renameFunctions = (serviceName, basePath, funcs) => {
  const keys = Object.keys(funcs);
  const functions = {};
  keys.forEach((k) => {
    const func = funcs[k];
    if (func.handler.indexOf("::") === -1) {
      func.handler = `${basePath}/src/functions/${func.handler}`;
    }
    // TODO: Fix the authorizer bits...
    // if (func.events) {
    //   func.events = func.events.map((e) => {
    //     if (e.http && e.http.authorizer) {
    //       e.http.authorizer = `${serviceName}-${e.http.authorizer}`;
    //     }
    //     if (e.websocket && e.websocket.authorizer) {
    //       e.websocket.authorizer = `${serviceName}-${e.websocket.authorizer}`;
    //     }
    //     return e;
    //   });
    // }
    functions[`${serviceName}-${k}`] = funcs[k];
    // functions[k] = funcs[k];
  });
  return functions;
};

module.exports = () => {

  const services = config.services;

  let functions = {};
  services.forEach((service) => {
    const basePath = `${config.servicesPath}/${service}/`;
    const serviceName = service;
    if (fs.existsSync(`${basePath}infrastructure/functions.yml`)) {
      let file = fs.readFileSync(`${basePath}infrastructure/functions.yml`, "utf8");
      file = file.replace(/\$\{self:service::toUpperCase\}/g, serviceName.toUpperCase);
      file = file.replace(/\$\{self:service\}/g, serviceName);
      const funcs = yaml.parse(file);

      functions = {
        ...functions,
        ...renameFunctions(serviceName, basePath, funcs),
      };
    }
  });

  return functions;
};
