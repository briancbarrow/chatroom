$(document).ready(function() {
    var socket = io();
    var messageInput = $('#message');
    var nicknameInput = $('#nickname');
    var messages = $('#messages');
    var connections = $('#connections');
    
    var getChatBox = function(test) {
        $('#nickname').fadeOut('slow', function() {
            $('#message').fadeIn('slow');
        });
        
    };

    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
    };
    
    var addNickname = function(name) {
        socket.emit('new-name', name);
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
    
    var newUser = function(name) {
        messages.html('');
        messages.append('<div id="notification">User ' + name + ' is now connected</div>');
        $('#notification').fadeOut(4000);
    };
    
    var updateUsers = function(users) {
        $('#current-users').html('');
        users.forEach(function(e) {
            if(users.length === 0) {
                return;
            } else {
                $('#current-users').append('<p>' + e.name + ' is ready to chat</p>');
            }
        })
    }
    
    nicknameInput.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }
        var nickname = nicknameInput.val();
        addNickname(nickname);
        nicknameInput.val('');
    });

    messageInput.on('keydown', function(event) {
        if (event.keyCode != 13) {
            socket.emit('typing', socket.username);
            return;
        }

        var message = messageInput.val();
        addMessage(message);
        socket.emit('message', message);
        socket.emit('stopped');
        messageInput.val('');
    });
    socket.on('typing', displayActivity);
    socket.on('new-user', newUser);
    socket.on('current-users', updateUsers);
    socket.on('users_count', displayCount);
    socket.on('message', addMessage);
    socket.on('getchat', getChatBox);
});