module.exports = function(client) {

	[
		'accountSet',
	].forEach(function(module) {
		client.prototype[module] = require('./'+module);
	});

};