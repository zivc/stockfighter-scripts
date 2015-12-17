process.chdir(__dirname);
var agent = require('superagent'),
	config = require('../config'),
	$q = require('q');

config.venue = 'GYTDEX';
config.ticker = 'TOLM';
config.account = 'IAR75129927';



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

function recursivePrice(cb) {
	getPrice(config.venue, config.ticker).then(function(price) {
		priceAverage.push(Math.max(price.bidSize,price.askSize));
		if (priceAverage.length === 5) {
			console.log('');
			console.log('Average prices for',config.ticker);
			console.log(priceAverage);
			console.log(calculateAveragePrice());

			cb();
		} else {
			setTimeout(recursivePrice, 5000);
		}
	}, function(err) {
		throw err;
	});
}

function calculateAveragePrice() {
	var filtered = priceAverage.sort().filter(function(price) {
		return price > 0;
	});

	if (filtered.length > 5) filtered = filtered.splice(filtered.length - 5, filtered.length);

	var sum = 0;
	filtered.forEach(function(price) {
		sum = sum + price;
	});
	return sum / filtered.length;
}

function marketOrder(venue, ticker, price, qty, direction) {

	var q = $q.defer();

	agent
		.post('https://api.stockfighter.io/ob/api/venues/'+venue+'/stocks/'+ticker+'/orders')
		.set('X-Starfighter-Authorization', config.key)
		.send({
			account:config.account,
			venue:venue,
			symbol:ticker,
			price:Math.ceil(price),
			qty:qty,
			direction:direction,
			orderType:"limit"
		})
		.end(function(err,res) {
			if (err) return q.reject(err);
			q.resolve(res.body);
		});

	return q.promise;

}

recursivePrice(function() {

	marketOrder(config.venue, config.ticker, calculateAveragePrice(), 100, 'buy').then(function(response) {
		console.log('response');
		console.log(response);
	}, function(err) {
		throw err;
	});

});





//var myPrice = 5800;

// agent
// 	.post('https://api.stockfighter.io/ob/api/venues/'+config.venue+'/stocks/'+config.ticker+'/orders')
// 	.set('X-Starfighter-Authorization', config.key)
// 	.send(order)
// 	.end(function(err,res) {
// 		console.log(err||res);
// 	});
