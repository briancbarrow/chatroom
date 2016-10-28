var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var connections = 0;
var currentUsers = {};


io.on('connection', function(socket) {
    connections++;
    var userId = connections;
    currentUsers[connections] = connections;
    console.log(currentUsers);
    console.log('Client connected', connections);
    io.emit('users_count', connections);
    io.emit('current-users', currentUsers);
    
    socket.broadcast.emit('new-user', userId);
    
    socket.on('typing', function() {
        var id = userId;
        socket.broadcast.emit('typing', id);
    });
    
    socket.on('message', function(message) {
        console.log('Received message:', message);
        socket.broadcast.emit('message', message);
    });
    
    socket.on('disconnect', function(socket) {
        connections--;
        io.emit('users_count', connections);
        console.log(currentUsers[userId]);
        delete currentUsers[userId];
        io.emit('current-users', currentUsers);
        console.log('Client disconnected', connections);
    });
});

// io.on('disconnect', function(socket) {
//     console.log('Client disconnected');
// });

server.listen(process.env.PORT || 8080);