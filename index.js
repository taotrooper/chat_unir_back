const http = require('http');
const express = require('express');
const cors = require('cors');

// Config .env
require('dotenv').config();

// Creación de la app de Express
const app = express();
app.use(cors());

// Creamos el servidor
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT);

server.on('listening', () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
}); // falta errores

// Config socket.io
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log('Se ha conectado un nuevo cliente');
    // acá se podría guardar en bbdd, etc
    // Mando un mensaje a todos los clientes, menos al que se conecta
    socket.broadcast.emit('mensaje_chat', {
        username: 'INFO',
        message: 'Se ha conectado un nuevo usuario'
    });

    // Actualizar el número de clientes conectados
    io.emit('clientes_conectados', io.engine.clientsCount);

    socket.on('mensaje_chat', (data) => {
        // Emitir el mensaje recibido a todos los clientes conectados
        io.emit('mensaje_chat', data);
    });

    socket.on('disconnect', () => {
        io.emit('mensaje_chat', {
            username: 'INFO',
            message: 'Se ha desconectado un usuario'
        });
        io.emit('clientes_conectados', io.engine.clientsCount);
    });
});