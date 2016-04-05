app.controller('ProjectCtrl', function ($scope, $routeParams, $location, DataManager) {
  if ($routeParams.name) {
    DataManager.getProject($routeParams.name, function (project) {
      if (!project) {
        $location.path("/404");
      }
      $scope.project = project;
      $scope.dependencies = project.dependencies;
      $scope.code = project.codeArray();
      angular.element(document).ready(function () {
        for (var i = 0; i < $scope.code.length; i++) {
          var editor = ace.edit("editor" + $scope.code[i].name);
          editor.setTheme("ace/theme/xcode");
          editor.getSession().setMode("ace/mode/javascript");
          editor.setValue($scope.code[i].code);
        }
      });
    });
    DataManager.getMethods($routeParams.name, function (methods) {
      $scope.methods = methods;
    });
  }

  $scope.goToEndpoint = function(method, endpoint) {
    $location.path("/project/" + $scope.project.subdomain + "/" + method + "/" + endpoint);
  };

  $scope.possibleMethods = ["GET","POST","PUT","DELETE"];

  $scope.newEndpoint = function(method) {
    $location.path("/project/" + $scope.project.subdomain + "/new/" + method);
  };

});
