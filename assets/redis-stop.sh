#!/bin/bash

docker stop -t 10 redis
docker rm -f redis
