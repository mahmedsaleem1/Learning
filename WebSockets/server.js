import http from 'node:http';
import fs from 'node:fs/promises'
import path from 'node:path'
import { WebSocketServer } from 'ws';
import { redisPublish, redisSubscribe } from './connection.js';

const REDIS_CHANNEL = 'ws-messages'

const HTTP_SERVER = http.createServer(async function (req, res) {
    try {
        const file_path = path.join(import.meta.dirname, 'index.html')
        const html_file = await fs.readFile(file_path, 'utf-8')
        res.setHeader('Content-Type', 'text/html')
        res.end(html_file)
    } catch (err) {
        res.statusCode = 500;
        res.end('Error loading index.html');
    }
});

const wsServer = new WebSocketServer({ server: HTTP_SERVER })

wsServer.on('connection', (socket) => {

    // new horizontal scaling | by using pub/sub
    redisSubscribe.subscribe(REDIS_CHANNEL)
    redisSubscribe.on('message', (channel, message) => {
        if (channel == REDIS_CHANNEL) {
            wsServer.clients.forEach(client => {
                client.send(message.toString())
            }) // broadcast message to all clients
        }
    })

    console.log('Connection is established')

    socket.on('message', (data) => {
        // broad casting the received message to all clients
        // wsServer.clients.forEach(client => {
        //     client.send(data.toString())
        // }) // problem with horizontal scaling

        // Rely the message to the broker
        console.log('Broadcasting message via Redis broker');

        redisPublish.publish(REDIS_CHANNEL, data.toString())
    })

    socket.on('close', () => {
        console.log('Connection is closed');
    })
})
const PORT = process.env.PORT || 3000
HTTP_SERVER.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})