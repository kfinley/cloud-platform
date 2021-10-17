const fs = require("fs");
const yaml = require("yaml");
const config = require('../../../sls.config');

module.exports = () => {

  const services = config.services;

  let resources = {};
  services.forEach((service) => {
    const basePath = `./services/${service}/`;
    const serviceName = service
    if (fs.existsSync(`${basePath}infrastructure/resources.yml`)) {
      let file = fs.readFileSync(`${basePath}infrastructure/resources.yml`, "utf8");
      file = file.replace(/\$\{self:service:::toUpperCase\}/g, serviceName.toUpperCase);
      file = file.replace(/\$\{self:service\}/g, serviceName);
      const serviceResources = yaml.parse(file);

      resources = {
        ...resources,
        ...serviceResources,
      };
    }
  });
  return resources;
};
