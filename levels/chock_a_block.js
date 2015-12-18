process.chdir(__dirname);
var StockfighterClient = require('../client/client'),
	sf = new StockfighterClient(require('../config.js'));

var exchange = 'TEEX',
	symbol = 'KFH',
	account = 'JAJ78073330';

// TEST NETWORK TO SEE IF EXCHANGE AND SYMBOL EXISTS

sf.venueSet(exchange).then(function(res) {
	console.log('Venue',res.venue,'is ok');

	sf.accountSet(account);

	sf.venueStocks().then(function(stocks) {
		if (stocks.filter(function(stock) {
			return stock.symbol === symbol;
		}).length === 1) {

			console.log('Symbol '+symbol+' exists');
			
			tradingAlgo();

		} else {
			throw new Error('No symbol '+symbol+' exists on '+exchange);
		}
	}, function(err) {
		throw err;
	})

}, function(err) {
	console.log(err);
});


// RUN TRADING ALGO

var tradingAlgo = function() {

	/*

		What we need to do is do the order, then wait for the order
		to complete, if it is still open for longer than 30 secs, 
		cancel it.

		Remake it at a higher price, slowly increment upwards

	*/

	console.log('Running trading algo')

	sf.stocksOrderbook(symbol).then(function(orders) {
		console.log('Orderbook',orders);

		orders.asks = orders.asks.sort(function(a,b) {
			if (a.price > b.price) return 1;
			if (a.price < b.price) return -1;
			return 0;
		});

		if (orders.asks.length > 0) {
			sf.stocksOrder(symbol, orders.asks[0].price, orders.asks[0].qty, 'buy', 'limit').then(function(res) {
				console.log(res);
				setTimeout(tradingAlgo, 500);
			}, function(err) {
				throw err;
			});
		} else {
			// retry in 5 seconds or buy the cheapest sale
			setTimeout(tradingAlgo, 5000);
		}

	}, function(err) {
		throw err;
	});

};



// process.chdir(__dirname);
// var agent = require('superagent'),
// 	config = require('../config'),
// 	$q = require('q');

// config.venue = 'GYTDEX';
// config.ticker = 'TOLM';
// config.account = 'IAR75129927';








// return;

// var priceAverage = [];

// function getPrice(venue, ticker) {
// 	var q = $q.defer();
// 	agent
// 		.get('http://api.stockfighter.io/ob/api/venues/'+venue+'/stocks/'+ticker+'/quote')
// 		.set('X-Starfighter-Authorization', config.key)
// 		.end(function(err,res) {
// 			if (err) return q.reject(err);
// 			q.resolve(res.body);
// 		});
// 	return q.promise;
// }

// function recursivePrice(callback) {

// 	getPrice(config.venue, config.ticker).then(function(price) {

// 		priceAverage.push(Math.max(price.bidSize,price.askSize));

// 		if (priceAverage.length >= 10) {
// 			console.log('');
// 			console.log('Average prices for',config.ticker);
// 			console.log(priceAverage);
// 			console.log('Average ask price', calculateAveragePrice());

// 			if (callback) return callback();
// 		} else {
// 			setTimeout(function() {
// 				recursivePrice(callback ? callback : function() {});
// 			}, 2000);
// 		}
// 	}, function(err) {
// 		throw err;
// 	});
// }

// function calculateAveragePrice() {
// 	var filtered = priceAverage.sort().filter(function(price) {
// 		return price > 0;
// 	});

// 	if (filtered.length > 5) filtered = filtered.splice(filtered.length - 5, filtered.length);

// 	var sum = 0;
// 	filtered.forEach(function(price) {
// 		sum = sum + price;
// 	});
// 	return sum / filtered.length;
// }

// function marketOrder(venue, ticker, price, qty, direction) {

// 	var q = $q.defer();

// 	agent
// 		.post('https://api.stockfighter.io/ob/api/venues/'+venue+'/stocks/'+ticker+'/orders')
// 		.set('X-Starfighter-Authorization', config.key)
// 		.send({
// 			account:config.account,
// 			venue:venue,
// 			symbol:ticker,
// 			price:Math.ceil(price),
// 			qty:qty,
// 			direction:direction,
// 			orderType:"limit"
// 		})
// 		.end(function(err,res) {
// 			if (err) return q.reject(err);
// 			q.resolve(res.body);
// 		});

// 	return q.promise;

// }

// var shares = 100;

// recursivePrice(function() {

// 	console.log('Performing market order!');

// 	setInterval(function() {
// 		if (shares >= 100000) {
// 			console.log('all done');
// 			process.exit(0);
// 		}
// 		marketOrder(config.venue, config.ticker, calculateAveragePrice(), 100, 'buy').then(function(response) {
// 			console.log('response');
// 			console.log(response);
// 			response.fills.forEach(function(fill) {
// 				priceAverage.shift();
// 				priceAverage.push(fill.price)
// 				shares = shares + fill.qty;
// 			});
// 		}, function(err) {
// 			throw err;
// 		});
// 	}, 100);

// });





// //var myPrice = 5800;

// // agent
// // 	.post('https://api.stockfighter.io/ob/api/venues/'+config.venue+'/stocks/'+config.ticker+'/orders')
// // 	.set('X-Starfighter-Authorization', config.key)
// // 	.send(order)
// // 	.end(function(err,res) {
// // 		console.log(err||res);
// // 	});
