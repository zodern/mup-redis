module.exports = {
  setup: function(api, nodemiral) {
    if (!api.getConfig().redis) {
      console.log(
        'Not setting up redis since there is no redis config'
      );
      return;
    }

    var redisSessions = api.getSessions(['redis']);
    var meteorSessions = api.getSessions(['app']);
    var redisConfig = api.getConfig().redis;

    if (meteorSessions.length !== 1) {
      console.log(
        'To use built-in redis setup, you have to have only one meteor server'
      );
      return;
    } else if (redisSessions[0]._host !== meteorSessions[0]._host) {
      console.log(
        'To use built-in redis setup, both the meteor app and redis db need to be on the same server'
      );
      return;
    }

    var list = nodemiral.taskList('Setup Redis');

    list.executeScript('Setup Environment', {
      script: api.resolvePath(__dirname, 'assets/redis-setup.sh'),
      vars: {
        redisVersion: redisConfig.version || '3.2.10-alpine',
        redisDir: '/opt/redis'
      }
    });

    return api.runTaskList(list, redisSessions, { verbose: api.getVerbose() });
  },
  logs: function(api) {
    var args = api.getArgs();
    var sessions = api.getSessions(['redis']);

    // remove redis from args sent to docker
    args.shift();

    return api.getDockerLogs('redis', sessions, args);
  },
  start: function(api, nodemiral) {
    var list = nodemiral.taskList('Start Redis');
    var sessions = api.getSessions(['redis']);
    var config = api.getConfig().redis;

    list.executeScript('Start Redis', {
      script: api.resolvePath(__dirname, 'assets/redis-start.sh'),
      vars: {
        redisVersion: config.version || '3.2.10-alpine',
        redisDir: '/opt/redis'
      }
    });

    return api.runTaskList(list, sessions, { verbose: api.getVerbose() });
  },
  stop: function(api, nodemiral) {
    var sessions = api.getSessions(['redis']);
    var list = nodemiral.taskList('Stop Redis');
    
    list.executeScript('Stop Redis', {
      script: api.resolvePath(__dirname, 'assets/redis-stop.sh')
    });

    return api.runTaskList(list, sessions, { verbose: api.getVerbose() });
  }
};
