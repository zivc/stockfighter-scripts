module.exports = function(venue) {
	var q = $q.defer(),
		venue = venue || this.venue;

	this.agent
		.get(this.parseApi('/venues/:venue/stocks', {venue:venue}))
		.end(function(err,res) {
			if (err) return q.reject(err);
			q.resolve(res.body.symbols);
		});

	return q.promise;
}