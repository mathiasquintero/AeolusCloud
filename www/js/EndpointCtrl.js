app.controller('EndpointCtrl', function ($scope, $routeParams, $location, DataManager) {
  if ($routeParams.name && $routeParams.method && $routeParams.endpoint) {

    DataManager.getEndpoint($routeParams.name,$routeParams.method,$routeParams.endpoint, function (item) {
      $scope.endpoint = item;
      $scope.code = item.codeArray();
      angular.element(document).ready(function () {
        for (var i = 0; i < $scope.code.length; i++) {
          var editor = ace.edit("editor" + $scope.code[i].name);
          editor.setTheme("ace/theme/xcode");
          editor.getSession().setMode("ace/mode/javascript");
          editor.setValue($scope.code[i].code);
        }
      });
      $scope.save = function() {
        for (var i = 0; i < $scope.code.length; i++) {
          if ($scope.code[i].set) {
            var editor = ace.edit("editor" + $scope.code[i].name);
            var value = editor.getValue();
            $scope.endpoint[$scope.code[i].name] = value;
          } else {
            $scope.endpoint[$scope.code[i].name] = undefined;
          }
        }
        var file = $scope.endpoint.toFile();
        console.log(file);
      };
    });


  }
});
