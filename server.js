var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var connections = 0;
var currentUsers = [];
var len;


io.on('connection', function(socket) {
    connections++;
    socket.userId = connections;
    // console.log('Client connected', socket.userId);
    io.emit('users_count', connections);
    io.emit('current-users', currentUsers);
    
    socket.on('new-name', function(name) {
        console.log('User added:', name);
        socket.username = name;
        len = currentUsers.length;
        currentUsers[len] = {};
        currentUsers[len].name = socket.username;
        console.log(currentUsers);
        socket.broadcast.emit('new-user', socket.username);
        io.emit('current-users', currentUsers);
        socket.emit('getchat', len);
    });
    
    socket.on('typing', function() {
        var name = socket.username;
        socket.broadcast.emit('typing', name);
    });
    
    socket.on('message', function(message) {
        console.log('Received message:', message);
        socket.broadcast.emit('message', message);
    });
    
    socket.on('disconnect', function() {
        connections--;
        for (var i = 0; i < currentUsers.length; i++) {
            if (currentUsers[i].name === socket.username) {
                console.log('Client disconnected', socket.username);
                currentUsers.splice(i, 1);
                io.emit('message', socket.username + ' has disconnected');
            }
        }
        io.emit('current-users', currentUsers);
        console.log(currentUsers);
        io.emit('users_count', connections);
    });
});

// io.on('disconnect', function(socket) {
//     console.log('Client disconnected');
// });

server.listen(process.env.PORT || 8080);