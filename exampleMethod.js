var Method = require('aeolus').Method;

\\requirements

var NameForMethod = new Method();

NameForMethod.handle(function(req,res) {
	\\handlingFunction
});

NameForMethod.setHasAuth(\\hasAuth);

NameForMethod.auth(\\authFunction);

module.exports = NameForMethod;
