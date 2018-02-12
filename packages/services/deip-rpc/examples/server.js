var deipRpc = require('../lib');

deipRpc.api.getAccountCount(function(err, result) {
	console.log(err, result);
});

deipRpc.api.getAccounts(['dan'], function(err, result) {
	console.log(err, result);
	var reputation = deipRpc.formatter.reputation(result[0].reputation);
	console.log(reputation);
});

deipRpc.api.getState('trending/deip', function(err, result) {
	console.log(err, result);
});

deipRpc.api.getFollowing('ned', 0, 'blog', 10, function(err, result) {
	console.log(err, result);
});

deipRpc.api.getFollowers('dan', 0, 'blog', 10, function(err, result) {
	console.log(err, result);
});

deipRpc.api.streamOperations(function(err, result) {
	console.log(err, result);
});

deipRpc.api.getDiscussionsByActive({
  limit: 10,
  start_author: 'thecastle',
  start_permlink: 'this-week-in-level-design-1-22-2017'
}, function(err, result) {
	console.log(err, result);
});
