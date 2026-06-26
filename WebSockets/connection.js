import { Redis } from 'ioredis'

export const redisPublish = new Redis({
    host: 'localhost',
    port: 6379
}) // to publish data to redis pubsub

export const redisSubscribe = new Redis({
    host: 'localhost',
    port: 6379
}) // to retreive data from redis pubsub and send it to all clients