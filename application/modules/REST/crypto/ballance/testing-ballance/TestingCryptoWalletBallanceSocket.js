const WebSocket = require('ws');

port = 7320;

const wss = new WebSocket.Server({ port: port });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('something');
});

module.exports = {
    port: port,
    server: wss,
};