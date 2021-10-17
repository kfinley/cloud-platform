const fs = require("fs");
const yaml = require("yaml");
const config = require('../../../sls.config');

module.exports = () => {
  const services = config.services;

  let stateMachines = {};
  services.forEach((service) => {
    const basePath = `./services/${service}/`;
    const serviceName = service

    if (fs.existsSync(`${basePath}infrastructure/stateMachines.yml`)) {
      let file = fs.readFileSync(`${basePath}infrastructure/stateMachines.yml`, "utf8");
      file = file.replace(/\$\{self:service:::toUpperCase\}/g, serviceName.toUpperCase);
      file = file.replace(/\$\{self:service\}/g, serviceName);
      const serviceStateMachines = yaml.parse(file);

      stateMachines = {
        ...stateMachines,
        ...serviceStateMachines,
      };
    }
  });

  return stateMachines;
};
