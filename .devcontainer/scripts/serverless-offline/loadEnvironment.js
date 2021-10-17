const fs = require("fs");
const yaml = require("yaml");
const config = require('../../../sls.config');

module.exports = () => {

  const services = config.services;

  let environment = {};
  for (i = 0; i < services.length; i++) {

    const basePath = `./services/${services[i]}/`;
    const serviceName = services[i];
    if (fs.existsSync(`${basePath}infrastructure/environment.yml`)) {
      let file = fs.readFileSync(`${basePath}infrastructure/environment.yml`, "utf8");
      file = file.replace(/\$\{self:service::toUpperCase\}/g, serviceName.toUpperCase());
      file = file.replace(/\$\{self:service\}/g, serviceName);
      const serviceEnvironment = yaml.parse(file);

      environment = {
        ...environment,
        ...serviceEnvironment,
      };
    }
  }

  return environment;
};
