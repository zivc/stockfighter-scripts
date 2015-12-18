module.exports = function(stock, price, qty, direction, orderType, account, venue) {
	var q = $q.defer(),
		venue = venue || this.venue,
		account = account || this.account;

	this.agent
		.post(this.parseApi('/venues/:venue/stocks/:stock/orders', {venue:venue, stock:stock}))
		.send({
			account:account,
			venue:venue,
			stock:stock,
			price:price,
			qty:Math.max(0,qty),
			direction:direction,
			orderType:orderType
		})
		.end(function(err,res) {
			if (err) return q.reject(err);
			q.resolve(res.body);
		});

	return q.promise;

}