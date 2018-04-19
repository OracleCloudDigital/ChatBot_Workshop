var utils = require("./utils");

module.exports = function(rest) {

    return Object.create({

        postEvent: function(event, opts, httpOptions){
			var optionsList = buildOptionsList('/mobile/platform/analytics/events', opts, httpOptions);
        	optionsList.json = event;
		    return utils().wrapMCSResult(rest.postAsync(optionsList));
        }
	}, {});

	function buildOptionsList(uri, opts, httpOptions){
		var optionsList = utils().buildOptionsList(uri, opts, httpOptions);
		// query parameters
		if (opts){
			// headers
			if (opts.applicationKey){
				optionsList.headers['Oracle-Mobile-Application-Key'] = opts.applicationKey;
			}
			if (opts.sessionId){
				optionsList.headers['Oracle-Mobile-Analytics-Session-ID'] = opts.sessionId;
			}
			if (opts.deviceId){
				optionsList.headers['Oracle-Mobile-Device-ID'] = opts.deviceId;
			}
		}
		return optionsList;
	}

}
