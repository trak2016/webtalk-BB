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

  socket.on('add-user', function(data) {
    if (clients[data.username] == undefined) { //if user name is unique
      clients[data.username] = {
        'socket': socket.id
      };
      self.sendInfoNewUser(socket.id, 'added');
      self.sendMessageToAllWithoutSpecyficUser(data.username, 'server', data.username + " joined us!");
      console.log(new Date() + '::Add new user: ' + data.username);
    } else {  //if user name already exists
      self.sendInfoNewUser(socket.id, 'exist');
      console.log(new Date() + '::User ' + data.username + ' already exists');
    }
  });

  //Removing the socket on disconnect
  socket.on('disconnect', function() {
  	for(var name in clients) {
  		if(clients[name].socket === socket.id) {
  			delete clients[name];
  			break;
  		}
  	}
  })

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

//Send status to the user who wants to join
self.sendInfoNewUser = function(socketId, msg) {
  io.sockets.connected[socketId].emit('new user info', msg);
}

//Send message to all users without specyfic user
self.sendMessageToAllWithoutSpecyficUser = function(excludedUserName, author, msg) {
  for(var name in clients) {
    if(name != excludedUserName) {
      io.sockets.connected[clients[name].socket].emit('message', {'msg': msg, 'author': author});
    }
  }
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});
