module.exports = function(client) {

	[
		'stocksOrder',
		'stocksOrderbook',
	].forEach(function(module) {
		client.prototype[module] = require('./'+module);
	});

};