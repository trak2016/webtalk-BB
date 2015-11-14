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
      //Receive chat message
      socket.on('chat message', function(msg){
        console.log("New message: " + msg);
        $scope.messages.push(msg);
        $scope.$apply();
      });

      //TODO: merge with 'chat message' listener
      socket.on('message', function(data){
        console.log('New message from ' + data.author + ': ' + data.msg);

        var message = data.msg;
        if ('server' !== data.author) {
          message = data.author + ': ' + message;
        }

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

    $scope.init();
}]);
