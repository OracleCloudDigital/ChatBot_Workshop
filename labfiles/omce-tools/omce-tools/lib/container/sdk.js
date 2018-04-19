var rest = require("./rest");
var sync = require("./sync");
var analytics = require("./analytics");
var notification = require("./notification");
var ums = require("./ums");
var restConnector = require("./restConnector");
var storage = require("./storage");
var connectors = require("./connectors");
var token = require("./token");
var namedAPI = require("./namedAPI");
var appConfig = require("./appConfig");
var database = require("./database");
var mbe = require("./mbe");
var location = require("./location");
var devices = require("./devices");

/**
 * Factory function (by convention we avoid capitalizing the function name)
 */

function sdk(internalParams, proxy) {

        var restInstance = rest(internalParams);
	return Object.create({

		sync: sync(),

		rest: restInstance,

		analytics: analytics(restInstance),

		notification: notification(restInstance, {
		    originalBackend: {
		        name: internalParams.rerouted_backendName,
		        version: internalParams.rerouted_backendVersion
		    },
		    targetBackend: {
		        name: internalParams.backendName,
		        version: internalParams.backendVersion
		    }
		}),

		ums: ums(restInstance),

		storage: storage(restInstance),

                database: database(restInstance),
		
		connectors: namedAPI(restInstance, internalParams.packageJson, 'connectors'),

		token: token(restInstance),
		
		appConfig: appConfig(restInstance),

		custom: namedAPI(restInstance, internalParams.packageJson, 'apis'),

		mbe: mbe(internalParams.backendName, internalParams.backendVersion, internalParams.mobile_backend_id),

		location: location(restInstance),

		devices: devices(restInstance),

		proxy: proxy

	});
}

/** Define the module as returning the SDK factory function */
module.exports = sdk;
