const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const square = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
};

const onRequest = (req, res) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) throw err;

    res.writeHead(200);
    res.end(data);
  });
};

const app = http.createServer(onRequest);

app.listen(PORT);

console.log(`listening on 127.0.0.1: ${PORT}`);

const io = socketio(app);

io.on('connection', (socket) => {
  socket.join('room1');

  socket.on('updateOnServer', (data) => {
    square.x = data.coords.x;
    square.y = data.coords.y;
    square.width = data.coords.width;
    square.height = data.coords.height;

    square.time = data.time;

    io.sockets.in('room1').emit('updateOnClient', square);
  });

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});

console.log('Websocket server started');
