$(document).ready(function() {
    var socket = io();
    var input = $('input');
    var messages = $('#messages');
    var connections = $('#connections');
    
    var userId;

    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
    };
    
    var displayCount = function(count) {
        connections.html('<p>There are ' + count + ' people in the chatroom</p>');
    };
    
    var displayActivity = function(user) {
        $('#activity').html(user + ' is typing...');
        setTimeout(function() {
            $('#activity').html('');
        }, 4000);
    };
    var stopActivity = function() {
        
    }
    
    var getUserId = function(id) {
        
    }
    
    var newUser = function(id) {
        messages.append('<div>User ' + id + ' is now connected</div>');
    };
    
    var updateUsers = function(users) {
        $('#current-users').html('');
        for(prop in users) {
            $('#current-users').append('<p>' + prop + ' is online</p>');
        };
    }

    input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            socket.emit('typing');
            return;
        }

        var message = input.val();
        addMessage(message);
        socket.emit('message', message);
        socket.emit('stopped');
        input.val('');
    });
    socket.on('typing', displayActivity);
    socket.on('new-user', newUser);
    // socket.on('stopped', stopActivity);
    socket.on('current-users', updateUsers);
    socket.on('users_count', displayCount);
    socket.on('message', addMessage);
});