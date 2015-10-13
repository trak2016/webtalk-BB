controllers.controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {

    var socket = io();

    $scope.message = '';
    $scope.login = '';
    $scope.showUserLoginForm = true;
    $scope.showChatForm = false;

    $scope.messages = [];

    $scope.onLoginUser = function() {
      // Tell the server about it
      var username = $scope.login;
      var user = { 'username': username}
      socket.emit('add-user', user);
      // Remove this form and show the chat form
      $scope.showUserLoginForm = false;
      $scope.showChatForm = true;
      $scope.login = '';
    };

    $scope.onSubmitMessage = function() {
      socket.emit('chat message', $scope.message);
      $scope.message = '';
    };

    $scope.init = function() {
      socket.on('chat message', function(msg){
        $scope.messages.push(msg);
        $scope.$apply()
        //$('#messages').append($('<li>').text(msg));
      });
    };

    $scope.init();
}]);
