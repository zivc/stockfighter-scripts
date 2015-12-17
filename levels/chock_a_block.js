process.chdir(__dirname);
var agent = require('superagent'),
	config = require('../config'),
	$q = require('q');

config.venue = 'GYTDEX';
config.ticker = 'TOLM';
config.account = 'IAR75129927';

var order = {
	account:config.account,
	venue:config.venue,
	symbol:config.ticker,
	price:5800,
	qty:100,
	direction:"buy",
	orderType:"limit"
};

var priceAverage = [];

function getPrice(venue, ticker) {
	var q = $q.defer();
	agent
		.get('http://api.stockfighter.io/ob/api/venues/'+venue+'/stocks/'+ticker+'/quote')
		.set('X-Starfighter-Authorization', config.key)
		.end(function(err,res) {
			if (err) return q.reject(err);
			q.resolve(res.body);
		});
	return q.promise;
}

function recursivePrice() {
	getPrice(config.venue, config.ticker).then(function(price) {
		priceAverage.push(price.askSize > price.bidSize ? price.askSize : price.bidSize);
		if (priceAverage.length === 5) {
			console.log('');
			console.log('Average prices for',config.ticker);
			console.log(priceAverage);
			console.log(calculateAveragePrice());
		} else {
			setTimeout(recursivePrice, 5000);
		}
	}, function(err) {
		throw err;
	});
}

recursivePrice();

function calculateAveragePrice() {
	var filtered = priceAverage.filter(function(price) {
		return price > 0;
	});
	var sum = 0;
	filtered.forEach(function(price) {
		sum = sum + price;
	});
	return sum / filtered.length;
}










//var myPrice = 5800;

// agent
// 	.post('https://api.stockfighter.io/ob/api/venues/'+config.venue+'/stocks/'+config.ticker+'/orders')
// 	.set('X-Starfighter-Authorization', config.key)
// 	.send(order)
// 	.end(function(err,res) {
// 		console.log(err||res);
// 	});
