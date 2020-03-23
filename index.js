var commandHandlers = require('./command-handlers');
var validate = require('./validate');

module.exports = {
  name: 'redis',
  description: 'Commands to setup and manage Redis',
  commands: {
    setup: {
      description: 'Installs and starts Redis',
      handler: commandHandlers.setup
    },
    logs: {
      description: 'View Redis logs',
      builder: function(yargs) {
        return yargs.strict(false);
      },
      handler: commandHandlers.logs
    },
    start: {
      description: 'Start Redis',
      handler: commandHandlers.start
    },
    stop: {
      description: 'Stop Redis',
      handler: commandHandlers.stop
    }
  },
  validate: {
    redis: validate
  },
  prepareConfig: function(config) {
    if (config.app && config.redis) {
      if (!config.app.docker) {
        config.app.docker = {};
      }
      if (!config.app.docker.args) {
        config.app.docker.args = [];
      }
      config.app.docker.args.push('--link=redis:redis');
      config.app.docker.args.push('--env=REDIS_URL=redis://redis:6379');
    }
  },
  hooks: {
    'post.setup': function(api) {
      if (!api.getConfig().redis) {
        return;
      }

      return api.runCommand('redis.setup')
        .then(function() {
          return api.runCommand('redis.start');
        });
    }
  }
};
