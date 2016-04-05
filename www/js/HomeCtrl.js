app.controller('HomeCtrl', function ($rootScope, $location) {
  if ($rootScope.user.loggedIn) {
    $location.path("/projects");
  }
});
