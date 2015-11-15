controllers.controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {

    var socket = io();

    $scope.message = '';
    $scope.login = '';
    $scope.showUserLoginForm = true;
    $scope.showChatForm = false;
    $scope.showExistUserMsg = false;

    $scope.messages = [];

    $scope.onLoginUser = function() {
      // Tell the server about it
      var username = $scope.login;
      var user = { 'username': username}
      socket.emit('add-user', user);
    };

    $scope.onSubmitMessage = function() {
      //Send message to all users
      socket.emit('chat message', $scope.message);
      $scope.message = '';
    };

    $scope.init = function() {
      //Receive message
      socket.on('message', function(data){
        console.log('New message ' + 'type: ' + data.type + ' from ' + data.author + ': ' + data.body);

        var message = data.body;
        if ('SYSTEM' !== data.author) { //message from other user
          message = data.author + ': ' + message;
        } else { //system message
          if ('JOIN' === data.type) { //message about new user
            message = message + ' join us!';
          }
        }

        //Add info about when message was sent
        message = $scope.getDate() + ' ' + message;

        //Add message to chat
        $scope.messages.push(message);
        $scope.$apply();
      });

      //Message with status from server about new user
      socket.on('new user info', function(msg){
        if ('added' === msg) { // Remove login form and show the chat form
          $scope.showUserLoginForm = false;
          $scope.showChatForm = true;
          $scope.login = '';
        } else { //Show message "User already exists"
          $scope.showExistUserMsg = true;
        }

        $scope.$apply();
      });
    };

    $scope.getDate = function() {
      var date = new Date();
      return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    };

    $scope.init();
}]);
