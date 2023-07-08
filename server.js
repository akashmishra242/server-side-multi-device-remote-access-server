const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    methods: ['GET', 'PATCH', 'POST', 'PUT'],
    origin: true,
  }
});

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from the Node.js RESTful side!'
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');



  socket.on('click-photo', (roomid) => {
    console.log(roomid.toString());
    socket.join(roomid);
    socket.broadcast.to(roomid).emit('click-a-photo', roomid);

  });
  socket.on('display-image', (roomid) => {
    console.log("display-image: " + roomid.toString());
    socket.join(roomid);
    socket.broadcast.to(roomid).emit('display-a-image', roomid);

  });

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
    // handleDisconnect()
  });

  socket.on('error', (err) => {
    console.log('received error from socket:', socket.id);
    console.log(err);
  });

  app.post('/trigger-event', (req, res) => {
    // Handle the API request from Postman or any other client
    // Process the request as needed

    // Emit a socket.io event to all connected Flutter clients
    io.emit('custom-event', { message: 'Event triggered' }, console.log('custom-event'));
    res.send('Event triggered successfully');
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});