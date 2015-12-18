global['$q'] = $q = require('q');
var	superagent = require('superagent-defaults')();

var StockfighterClient = function(configObj) {
	this.key = configObj.key || '';
	this.api = configObj.api || '';

	superagent
		.set('X-Starfighter-Authorization', this.key);

	this.agent = superagent;
};

StockfighterClient.prototype.parseApi = function(uri, obj) {
	var apiCall = this.api + uri;
	Object.keys(obj).forEach(function(key) {
		apiCall = apiCall.replace(':'+key, obj[key]);
	});
	return apiCall;
};

[
	'./venue/venue',
	'./account/account',
	'./stocks/stocks'
].forEach(function(module) {
	require(module)(StockfighterClient);
});

module.exports = StockfighterClient;