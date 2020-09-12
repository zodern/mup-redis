# mup-redis

Plugin for Meteor Up to setup and run Redis. Redis is run with `--appendonly yes` for persistance.

## Use

Install with `npm i -g mup-redis`.
Then, add to the `plugins` array in your mup config, and add a `redis` object.

```js
module.exports = {
  // rest of config

  plugins: ['mup-redis'],
  redis: {
    // Server to run redis on.
    servers: { one: {} },
    // Version of redis. Add '-alpine' to use a much smaller docker image
    version: '3.2.10-alpine'
  }
}
```

Next, run

```bash
mup setup
mup reconfig
```

Redis adds the environment variable `REDIS_URL` to the app. You cannot access redis from outside the server.

## Commands
- `mup redis setup`
- `mup redis start`
- `mup redis stop`
- `mup redis logs` View redis logs. Supports the same arguments as `mup logs`, including `--tail` and `--follow`.

## Redis Oplog
To use with [Redis Oplog](https://github.com/cult-of-coders/redis-oplog),
add the following configuration to your `settings.json`:
```json
{
  "redisOplog": {
    "redis": {
      "host": "redis",
      "port": 6379
    }
  }
}
```
