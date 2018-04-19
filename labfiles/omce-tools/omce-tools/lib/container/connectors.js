var restConnector = require("./restConnector");

var getRest = function(internalParams, invokeServiceMocks) {
    var restInstance = rest(internalParams, invokeServiceMocks);
    restInstance['delete'] = restInstance['del'];
    return restInstance;
};

/**
 * Factory function (by convention we avoid capitalizing the function name)
 */

function connectors(restLibrary) {

	return Object.create({
		rest: restConnector(restLibrary),
	});
}

/** Define the module as returning the SDK factory function */
module.exports = connectors;
