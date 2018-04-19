var utils = require("./utils");

module.exports = function(rest, packageJson, type) {
	var returnValue = {

		get: getFunction.bind(this, rest, type),
		
		put: putFunction.bind(this, rest, type),

		post: postFunction.bind(this, rest, type),
		
		head: headFunction.bind(this, rest, type),
		
		options: optionsFunction.bind(this, rest, type),
		
		del: deleteFunction.bind(this, rest, type),
		delete: deleteFunction.bind(this, rest, type),

		patch: patchFunction.bind(this, rest, type)
	};

	if (packageJson.oracleMobile && packageJson.oracleMobile.dependencies && packageJson.oracleMobile.dependencies[type]){
		for (var property in packageJson.oracleMobile.dependencies[type]){
			var index = property.lastIndexOf('/') >= 0 ? property.lastIndexOf('/') + 1 : 0 ;
			var apiName = property.substring(index, property.length);
			var api = {
				get: getFunction.bind(this, rest, type, apiName),
		
				put: putFunction.bind(this, rest, type, apiName),

				post: postFunction.bind(this, rest, type, apiName),
		
				head: headFunction.bind(this, rest, type, apiName),
		
				options: optionsFunction.bind(this, rest, type, apiName),
		
				del: deleteFunction.bind(this, rest, type, apiName),
				delete: deleteFunction.bind(this, rest, type, apiName),

				patch: patchFunction.bind(this, rest, type, apiName)
			};

			returnValue[apiName] = api;
		}
	}


	return Object.create(returnValue, {});

};

var getFunction = function(rest, type, apiName, endpointName, opts, httpOptions){
	var optionsList = buildOptionsList(apiName, endpointName, type, opts, httpOptions);
	return utils().wrap(rest, 'get', optionsList, opts);
};

var putFunction = function(rest, type, apiName, endpointName, object, opts, httpOptions){
	var optionsList = buildOptionsList(apiName, endpointName, type, opts, httpOptions);
	if (object){
	    optionsList.body = object;
	}
	return utils().wrap(rest, 'put', optionsList, opts);
};

var postFunction = function(rest, type, apiName, endpointName, object, opts, httpOptions){
	var optionsList = buildOptionsList(apiName, endpointName, type, opts, httpOptions);
	if (object){
	    optionsList.body = object;
	}
	return utils().wrap(rest, 'post', optionsList, opts);
};
 
var headFunction = function(rest, type, apiName, endpointName, opts, httpOptions){
	var optionsList = buildOptionsList(apiName, endpointName, type, opts, httpOptions);
	return utils().wrap(rest, 'head', optionsList, opts);
};

var optionsFunction = function(rest, type, apiName, endpointName, opts, httpOptions){
	var optionsList = buildOptionsList(apiName, endpointName, type, opts, httpOptions);
	return utils().wrap(rest, 'options', optionsList, opts);
};

var deleteFunction = function(rest, type, apiName, endpointName, opts, httpOptions){
	var optionsList = buildOptionsList(apiName, endpointName, type, opts, httpOptions);
	return utils().wrap(rest, 'delete', optionsList, opts);
};

var patchFunction = function(rest, type, apiName, endpointName, object, opts, httpOptions){
	var optionsList = buildOptionsList(apiName, endpointName, type, opts, httpOptions);
	if (object){
        optionsList.body = object;
    }
	return utils().wrap(rest, 'patch', optionsList, opts);
};

function buildOptionsList(apiName, endpointName, type, opts, httpOptions){
	var typeString = type == 'apis' ? 'custom' : 'connector';
	var uri = '/mobile/' + typeString + '/' + apiName;
        if (endpointName && !(endpointName == "")){
            uri = uri + '/' + endpointName;
        }
	var optionsList = utils().buildOptionsList(uri, opts, httpOptions);
	// query parameters
	if (opts){
		if (opts.qs){
			optionsList.qs = opts.qs;
		}

		// headers
		if (!optionsList.headers){
			optionsList.headers = {};
		}
		if (opts.versionToInvoke){
			optionsList.headers['oracle-mobile-api-version'] = opts.versionToInvoke;
		}
		if (opts.externalAuthorization){
			optionsList.headers['oracle-mobile-external-authorization'] = opts.externalAuthorization;
		}
	}
	return optionsList;
}
