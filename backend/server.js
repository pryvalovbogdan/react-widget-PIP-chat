import express from 'express';
import path, { dirname } from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import subdomain from 'express-subdomain';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

const mySubdomainRouter = express.Router();
app.use(subdomain('spiderman', mySubdomainRouter));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
const port = 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, 'public')));

let numUsers = 0;
// creating custom proxy to unblock iframe streaming subdomain
app.get('/proxy', async (req, res) => {
  const targetUrl = 'http://spiderman.localhost:5173'; // or wherever

  try {
    const response = await fetch(targetUrl);
    const body = await response.text();

    res.send(body);
  } catch (error) {
    res.status(500).send('Error occurred');
  }
});

io.on('connection', socket => {
  let addedUser = false;

  socket.on('new message', data => {
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data,
    });
  });

  socket.on('add user', username => {
    if (addedUser) return;

    socket.username = username;
    ++numUsers;
    addedUser = true;

    socket.emit('login', {
      numUsers: numUsers,
    });

    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
    });
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username,
    });
  });

  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username,
    });
  });

  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers,
      });
    }
  });

  socket.on('offer', data => {
    socket.broadcast.emit('offer', data);
  });

  socket.on('answer', data => {
    socket.broadcast.emit('answer', data);
  });

  socket.on('ice-candidate', data => {
    socket.broadcast.emit('ice-candidate', data);
  });

  socket.on('send-canvas-data', data => {
    console.log('Received canvas data');
    socket.broadcast.emit('receive-canvas-data', data);
  });

  socket.on('stop-streaming-canvas', data => {
    console.log('stop stream canvas');

    socket.broadcast.emit('stop-streaming-canvas', data);
  });
});
