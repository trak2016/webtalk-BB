var services = angular.module('WebTalkServices', []);
var controllers = angular.module("WebTalkControllers", ['WebTalkServices']);
var PGSWebTalk = angular.module("WebTalk", ['ngRoute', 'WebTalkControllers']);

PGSWebTalk.config(['$routeProvider',
		function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'partials/main.html',
			controller: 'MainCtrl'
		})
		.otherwise({
	        redirectTo: '/main'
	      });
}]);
