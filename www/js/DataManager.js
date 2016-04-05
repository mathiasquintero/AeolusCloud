var Method = function() {
  this.handler = function(req,res) {
    res.respondPlainText("This is a new Method!");
  };
  this.name = "";
  this.needsAuth = false;
  this.authHandler = false;
};

Method.prototype.handle = function (f) {
  this.handler = f;
};

Method.prototype.auth = function (f) {
  this.authHandler = f;
  if (f) {
    this.needsAuth = true;
  }
};

Method.prototype.setHasAuth = function (b) {
  this.needsAuth = b;
};

var exampleCode = {
  "auth": "function (user, pass, callback) {\n\tcallback(true);\n}",
  "custom": "var custom = require('custom');",
  "onError": "function (request, response) {\n\tresponse.respondPlainText('Page not found',404);\n}",
  "unauthorised": "function (request, response) {\n\tresponse.promptForPassword('You are not allowed to access this resource');\n}"
};

var Project = function(subdomain, repo, running, dependencies, methods) {
  this.subdomain = subdomain;
  this.repo = repo;
  this.running = running;
  this.methodsPath = methods || 'methods';
  this.dependencies = dependencies;
  this.auth = undefined;
  this.onError = undefined;
  this.unauthorised = undefined;
};

Project.prototype.codeArray = function () {
  var array = [{
    name: "auth",
    description: "Authentication"
  },{
    name: "onError",
    description: "Error Handler"
  },{
    name: "unauthorised",
    description: "Unauthorised"
  }];
  var o = this;
  array = array.map(function(item) {
    item.code = o[item.name] || exampleCode[item.name];
    item.set = o[item.name] ? true : false;
    return item;
  });
  return array;
};

var Endpoint = function(method, name, project) {
  this.name = name;
  this.method = method;
  this.project = project;
  this.auth = undefined;
  this.custom = undefined;
  this.hasAuth = false;
  this.handler = "function (request, response) {\n\tresponse.respondPlainText('Performed " + method + " on /" + name + "');\n}";
};

Endpoint.prototype.toFile = function() {
  var file = "var Method = require('aeolus').Method;\n\n";
  if (this.custom) {
    file += this.custom + "\n\n";
  }
  file += "var " +  this.name + " = new Method();\n\n";
  file += this.name + ".handle(" + this.handler + ");\n\n";
  if (this.auth) {
    file += this.name + ".auth(" + this.auth + ");\n\n";
  }
  if (this.hasAuth) {
    file += this.name + ".setHasAuth(true)\n\n";
  }
  file += "module.exports = " + this.name;
  return file;
};

Endpoint.prototype.codeArray = function () {
  var array = [{
    title: "Custom Code",
    name: "custom",
    description: "insert any code you want to be able to use. Custom functions etc",
    optional: true
  },{
    title: "Custom Authentication",
    name: "auth",
    description: "insert a special function for authentication that should only affect this endpoint.",
    optional: true
  },{
    title: "Handler",
    name: "handler",
    description: "This is the code that will be called when someone does a request.",
    optional: false
  }];
  var o = this;
  array = array.map(function(item) {
    item.code = o[item.name] || exampleCode[item.name];
    item.set = o[item.name] ? true : false;
    return item;
  });
  return array;
};

Endpoint.prototype.webURL = function () {
  return "http://github.com/" + this.project.repo + "/tree/master/" + this.project.methodsPath + "/" + this.method.toLowerCase() + "/" + this.name + ".js";
};

var endpointParser = function(method, name, project, data) {
  var item = new Endpoint(method, name, project);
  var importer = "require('aeolus').Method;";
  var indexOfMethodImport = data.indexOf(importer);
  data = data.substring(indexOfMethodImport + importer.length);
  data = data.replace('module.exports', '_parsedEndpoint_').replace("require", "0 // require");
  eval(data);
  var handler = _parsedEndpoint_.handler.toString(4);
  var hasAuth = _parsedEndpoint_.needsAuth;
  var auth = _parsedEndpoint_.authHandler;
  item.handler = handler;
  item.hasAuth = hasAuth;
  if (auth) {
    item.auth = auth;
  }
  return item;
};

app.service('DataManager', ['$http','$sce', '$q', function($http, $sce, $q) {

  var projects = [new Project('example','AtomicLlama/AeolusExampleProject', false, [])];

  var colorForMethods = {
    "get": "green",
    "post": "blue",
    "put": "orange",
    "delete": "red"
  };

  var order = {
    "get": 1,
    "post": 2,
    "put": 3,
    "delete": 4
  };

  var urlForPath = function(repo, path) {
    return "https://api.github.com/repos/" + repo + "/contents/" + path;
  };

  var getEndpointsForMethod = function(url, method, callback) {
    $http.get(url).then(function(res) {
      var files = res.data.filter(function(item) {
        var dots = item.name.split(".");
        return item.type === 'file' && dots[dots.length-1] === 'js';
      });
      method.endpoints = files.map(function(item) { return item.name.replace(".js",""); });
      callback();
    }, function(res) {
      callback();
    });
  };

  var getMethods = function(repo, callback) {
    var url = urlForPath(repo, 'methods');
    $http.get(url).then(function(res) {
      var dirs = res.data.filter(function(item) { return item.type === 'dir'; });
      var methods = dirs.map(function(item) {
        return {
          method: item.name,
          color: colorForMethods[item.name],
          endpoints: []
        };
      });
      var count = 0;
      var success = function() {
        count++;
        if (count === methods.length) {
          callback(methods);
        }
      };
      methods.sort(function(a,b) { return order[a.method] - order[b.method]; });
      for (var i = 0; i < dirs.length; i++) {
        var method = methods[i];
        var addr = urlForPath(repo, 'methods/' + method.method);
        getEndpointsForMethod(addr, method, success);
      }
    }, function(err) {
      callback([]);
    });
  };

  return {
    getProjects: function(callback) {
      callback(projects);
    },
    getProject: function(name, callback) {
      var project = projects.filter(function(item) { return item.subdomain === name; })[0];
      callback(project);
    },
    getMethods: function(name, callback) {
      var project = projects.filter(function(item) { return item.subdomain === name; })[0];
      getMethods(project.repo, callback);
    },
    getEndpoint: function(project, method, name, callback) {
      var p = projects.filter(function(item) { return item.subdomain === project; })[0];
      var url = urlForPath(p.repo, 'methods/' + method + '/' + name + '.js');
      console.log(url);
      $http.get(url).then(function(res) {
        var data = window.atob(res.data.content.replace(/\s/g, ''));
        console.log(data);
        var endpoint = endpointParser(method,name,p,data);
        callback(endpoint);
      });
    }
  };

}]);
