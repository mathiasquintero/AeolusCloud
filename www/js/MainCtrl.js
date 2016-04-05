app.controller('MainCtrl', function ($rootScope, $http, $location,$window) {

  $rootScope.message = "Hello";

  $rootScope.searchText = "";
  $rootScope.user = {
    name: "Mathias Quintero",
    id: "someID",
    token: "someToken",
    loggedIn: false,
    image: "https://avatars2.githubusercontent.com/u/13184158?v=3&s=460"
  };

  $rootScope.notFound = function() {
    $location.path("/404");
  };

  var login = function(response) {

  };

  $rootScope.logIn = function() {
    $rootScope.user.loggedIn = true;
    $location.path("/projects");
  };

  $rootScope.logOut = function() {
    $rootScope.user.loggedIn = false;
    $location.path("/");
  };

});
