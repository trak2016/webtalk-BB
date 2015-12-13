services.service('StateService', function ($rootScope) {

    var socket = io();
    var isLoggedUser = false;

    return {
      getSocketIO: function() {
        return socket;
      },

      setLoggedUser: function(val) {
        isLoggedUser = val
      },

      isLoggedUser: function() {
        return isLoggedUser;
      }
    }
});
