import express from 'express';
import ws from 'ws';
import WebSocket from 'ws';


const app = express();

app.get('/', (req, res) => {
    res.send(`Welcome ${req.hostname}`);
})

const server = app.listen(3000, () => {
    console.log(`server is running on port 3000`);
});

const wsServer = new ws.Server({
    noServer: true, path: '/ws'
});

wsServer.on('connection', socket => {
    wsServer.clients.forEach(client => { 
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Number of connected users ${wsServer.clients.size}`, { binary: false });
      }
    });
    socket.on('close', (code, reason) => {
        console.log('WebSocket connection closed', code, reason);
    });
});

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (client) => {
        wsServer.emit('connection', client, request);
    });
});