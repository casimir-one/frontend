var deip = require('../lib');

deip.api.getAccountCount(function(err, result) {
	console.log(err, result);
});

deip.api.getAccounts(['dan'], function(err, result) {
	console.log(err, result);
	var reputation = deip.formatter.reputation(result[0].reputation);
	console.log(reputation);
});

deip.api.getState('trending/deip', function(err, result) {
	console.log(err, result);
});

deip.api.getFollowing('ned', 0, 'blog', 10, function(err, result) {
	console.log(err, result);
});

deip.api.getFollowers('dan', 0, 'blog', 10, function(err, result) {
	console.log(err, result);
});

deip.api.streamOperations(function(err, result) {
	console.log(err, result);
});

deip.api.getDiscussionsByActive({
  limit: 10,
  start_author: 'thecastle',
  start_permlink: 'this-week-in-level-design-1-22-2017'
}, function(err, result) {
	console.log(err, result);
});
