module.exports = function(router){ 
	require('./userController')(router);
	require('./classController')(router);
	require('./eventController')(router);
	require('./flowController')(router);
	require('./postController')(router);
	require('./classUserController')(router)
	require('./schoolUserController')(router)
	require('./schoolController')(router);
	require('./lookupController')(router);
	require('./richTextController')(router);
};