process.chdir(__dirname);
var agent = require('superagent'),
	config = require('../config');

config.venue = 'FRMEX';
config.ticker = 'IYQU';
config.account = 'SAR80403386';

var order = {
	account:config.account,
	venue:config.venue,
	symbol:config.ticker,
	price:5800,
	qty:100,
	direction:"buy",
	orderType:"limit"
};

var myPrice = 5800;

agent
	.get('http://api.stockfighter.io/ob/api/venues/'+config.venue+'/stocks/'+config.ticker+'/quote')
	.set('X-Starfighter-Authorization', config.key)
	.end(function(err,res) {
		console.log(err||res.body);
	});


// agent
// 	.post('https://api.stockfighter.io/ob/api/venues/'+config.venue+'/stocks/'+config.ticker+'/orders')
// 	.set('X-Starfighter-Authorization', config.key)
// 	.send(order)
// 	.end(function(err,res) {
// 		console.log(err||res);
// 	});
