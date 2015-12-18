module.exports = function(client) {

	[
		'stocksOrder',
		'stocksOrderbook',
		'stocksOrderStatus'
	].forEach(function(module) {
		client.prototype[module] = require('./'+module);
	});

};
