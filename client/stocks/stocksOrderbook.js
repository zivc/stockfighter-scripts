module.exports = function(stock, venue) {

	var q = $q.defer(),
		venue = venue || this.venue;

	this.agent
		.get(this.parseApi('/venues/:venue/stocks/:stock', {stock:stock, venue:venue}))
		.end(function(err,res) {
			if (err) return q.reject(err);
			q.resolve(res.body);
		});

	return q.promise;
};