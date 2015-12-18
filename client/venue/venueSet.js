module.exports = function(venue) {
	var q = $q.defer();

	this.venueCheck(venue).then(function(response) {
		this.venue = venue;
		q.resolve(response);
	}.bind(this), function(err) {
		q.reject(err);
	})

	return q.promise;
};