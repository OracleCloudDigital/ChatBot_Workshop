var utils = require("./utils");

module.exports = function(rest) {

    return Object.create({

        get: function(opts){
		    return utils().wrapMCSResult(rest.getAsync(buildOptionsList(opts)));
        },
		
		put: function(opts){

		    return utils().wrapMCSResult(rest.putAsync(buildOptionsList(opts)));
        },
		
		post: function(opts){
		    return utils().wrapMCSResult(rest.postAsync(buildOptionsList(opts)));
        },
		
		del: function(opts){
		    return utils().wrapMCSResult(rest.delAsync(buildOptionsList(opts)));
        },

		options: function(opts){
		    return utils().wrapMCSResult(rest.optionsAsync(buildOptionsList(opts)));
        }
	}, {});

	function buildOptionsList(opts){
		var uri = '/mobile/connector/' + opts.name;
		if (opts.uriExtension){
			uri = uri + '/' + opts.uriExtension;
		}
		
        var optionsList={
		       uri: uri,
				qs: opts.qs
        };
		if (opts.headers){
			optionsList.headers = opts.headers;
		} else {
			optionsList.headers = [];
		}
		if (opts.version){
			optionsList.headers['oracle-mobile-api-version'] = opts.version;
		}
		if (opts.object){
			optionsList.json = opts.object;
		}
		return optionsList;
	}

}