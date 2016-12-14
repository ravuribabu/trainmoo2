var NodeCache = require('node-cache');

const appCache = new NodeCache();

module.exports = {
	cache : appCache
}