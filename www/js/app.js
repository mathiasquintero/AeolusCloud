var app = angular.module('aeolus', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'partials/home.html',
    controller: 'HomeCtrl'
  }).
  when('/projects', {
    templateUrl: 'partials/project-list.html',
    controller: 'ProjectListCtrl'
  }).
  when('/projects/new', {
    templateUrl: 'partials/project-new.html',
    controller: 'NewProjectCtrl'
  }).
  when('/project/:name', {
    templateUrl: 'partials/project.html',
    controller: 'ProjectCtrl'
  }).
  when('/project/:name/new/:method', {
    templateUrl: 'partials/new-endpoint.html',
    controller: 'NewEndpointCtrl'
  }).
  when('/project/:name/:method/:endpoint', {
    templateUrl: 'partials/endpoint.html',
    controller: 'EndpointCtrl'
  }).
  when('/404',{
    templateUrl: 'partials/404.html'
  }).
  otherwise({
    redirectTo: '/404'
  });
}]);
