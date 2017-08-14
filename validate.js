var joi = require('joi');

var schema = joi.object().keys({
  version: joi.string(),
  servers: joi.object().keys().required()
});

module.exports = function(config, utils) {
  var details = [];

  var validationErrors = joi.validate(config.redis, schema, utils.VALIDATE_OPTIONS);
  details = utils.combineErrorDetails(details, validationErrors);
  details = utils.combineErrorDetails(
    details,
    utils.serversExist(config.servers, config.redis.servers)
  );

  return utils.addLocation(details, 'redis');
};
