module.exports = function(client) {

	[
		'venueCheck',
		'venueSet',
		'venueStocks'
	].forEach(function(module) {
		client.prototype[module] = require('./'+module);
	});

};