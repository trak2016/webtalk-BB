controllers.controller('MainCtrl', ['$scope', '$http', 'StateService', function ($scope, $http, StateService) {

    var socket = StateService.getSocketIO();

    $scope.message = '';
    $scope.login = '';

    $scope.messages = [];

    $scope.isLoggedUser = StateService.isLoggedUser;

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
          } else if ('DISCONNECT' === data.type) { //message about disconnected user
            message = message + ' left the chat';
          }
        }

        var date = new Date();
        message = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' ' + message;

        //Add message to chat

        $scope.$apply( function() {
          $scope.messages.push(message);
        });
      });

      //Message with status from server about new user
      socket.on('new user info', function(msg){
        if ('added' === msg) { // Remove login form and show the chat form
          StateService.setLoggedUser(true);
          $scope.login = '';
        } else { //Show message 'User already exists'
          $scope.showExistUserMsg = true;
        }

        $scope.$apply();
      });
    };

    $scope.init();
}]);
