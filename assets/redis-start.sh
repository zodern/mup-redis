#!/bin/bash

REDIS_VERSION=<%= redisVersion %>
REDIS_DIR=<%= redisDir %>

set -e
sudo docker pull redis:$REDIS_VERSION

set +e

docker stop -t=10 redis
sudo docker rm -f redis

set -e

echo "Starting redis:$REDIS_VERSION"

sudo docker run \
  -d \
  --restart=always \
  --publish=127.0.0.1:6379:6379 \
  --volume $REDIS_DIR/data:/data \
  --name=redis \
  redis:$REDIS_VERSION \
  redis-server --appendonly yes
