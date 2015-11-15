var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};

var self = this;

app.use('/resources', express.static(__dirname + '/resources'));
app.use('/partials', express.static(__dirname + '/partials'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){

  //When user wants join to chat
  socket.on('add-user', function(data) {
    if (clients[data.username] == undefined) { //if user name is unique
      clients[data.username] = {
        'socket': socket.id
      };
      self.sendInfoNewUser(socket.id, 'added');
      self.sendMessageAboutNewUser(data.username);
      console.log(new Date() + '::Add new user: ' + data.username + ' with socket id: ' + socket.id);
    } else {  //if user name already exists
      self.sendInfoNewUser(socket.id, 'exist');
      console.log(new Date() + '::User ' + data.username + ' already exists');
    }
  });

  //Removing the socket on disconnect
  socket.on('disconnect', function() {
    var username = self.getUserNameBySocketId(socket.id);
    console.log('Disconnect user ' + username);

    //Remove from users list
  	for(var name in clients) {
  		if(clients[name].socket === socket.id) {
  			delete clients[name];
  			break;
  		}
  	}

    //Send message to other users about it
    var data = {'type' : 'DISCONNECT',
                'author': 'SYSTEM',
                'body': username};
    self.sendMessageToAll(data);
  })

  //Receive chat message
  socket.on('chat message', function(msg){
    var data = {'type' : 'MSG',
                'author': self.getUserNameBySocketId(socket.id),
                'body': msg};

    console.log('Message from ' + data.author + ': ' + data.body);

    self.sendMessageToAll(data);
  });
});

//Get user name form users list by socket id
self.getUserNameBySocketId = function(socketId) {
  for(var name in clients) {
    if(clients[name].socket === socketId) {
      return name;
    }
  }
}

//Send message to other users about new user
self.sendMessageAboutNewUser = function(username) {
  var data = {'type': 'JOIN',
              'author': 'SYSTEM',
              'body': username};

  self.sendMessageToAllWithoutSpecyficUser(username, data);
}

//Send status to the user who wants to join
self.sendInfoNewUser = function(socketId, msg) {
  io.sockets.connected[socketId].emit('new user info', msg);
}

//Send message to all users
self.sendMessageToAll = function(data) {
  io.emit('message', data);
}

//Send message to all users without specyfic user
self.sendMessageToAllWithoutSpecyficUser = function(excludedUserName, data) {
  for(var name in clients) {
    if(name != excludedUserName) {
      io.sockets.connected[clients[name].socket].emit('message', data);
    }
  }
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});
