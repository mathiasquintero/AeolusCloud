app.controller('ProjectListCtrl', function ($scope, $location, DataManager) {
  DataManager.getProjects(function(projects) {
    $scope.projects = projects;
  });
  $scope.goTo = function(subdomain) {
    $location.path("/project/" + subdomain);
  };
});
