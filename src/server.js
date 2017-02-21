const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end(0);
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1 ${port}`);

const io = socketio(app);

const onJoin = (sock) => {
  const socket = sock;

  socket.on('join', () => {
    socket.join('room1');
    socket.on('draw', (data) => {
      socket.broadcast.to('room1').emit('msg', data);
    });
  });
};

io.sockets.on('connection', (socket) => {
  console.log('started');
  onJoin(socket);
});
console.log('Websocket server started');
