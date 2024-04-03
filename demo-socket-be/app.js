var express = require('express');
const http = require('http');
var app = express();
const { networkInterfaces } = require('os');
const server = http.createServer(app);

const socketIo = require('socket.io')(server, {
  cors: {
    origin: '*', // accept client
  },
});

count = 0;
socketIo.on('connection', (socket) => {
  count++;
  socket.emit('count', count);
  socket.broadcast.emit('count', count);
  console.log({ count });
  console.log('New client connected' + socket.id);

  socket.on('sendDataClient', function (data) {
    console.log(data);
    socketIo.emit('sendDataServer', data);
  });

  socket.on('disconnect', () => {
    count--;
    console.log({ count });

    socket.emit('count', count);
    socket.broadcast.emit('count', count);
    console.log('Client disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('hello world');
});

function getLocalIPAddress() {
  const nets = networkInterfaces();
  const results = Object.create(null); // Or just '{}', an empty object

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
      if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }
  return results;
}

const localIPAddress = getLocalIPAddress();
const ipv4Address = localIPAddress[Object.keys(localIPAddress)[0]][0];
server.listen(4000, ipv4Address, () => {
  console.log(`Server is running on: ${ipv4Address}:4000`);
});
