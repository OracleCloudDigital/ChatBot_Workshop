var utils = require("./utils");

module.exports = function(rest) {

    return Object.create({

        getUser: function(opts, httpOptions){
			var user = '~';
			if (opts && opts.username){
				user = opts.username;
			}
			var optionsList = buildOptionsList('/mobile/platform/users/' + user, opts, httpOptions);
			optionsList.json = true;

		    return utils().wrapMCSResult(rest.getAsync(optionsList));
        },

        getUserExtended: function(opts, httpOptions){
			var user = '~';
			if (opts && opts.username){
				user = opts.username;
			}
			var optionsList = buildOptionsList('/mobile/platform/extended/users/' + user, opts, httpOptions);
			optionsList.json = true;

		    return utils().wrapMCSResult(rest.getAsync(optionsList));
        },

        updateUser: function(newFields, opts, httpOptions){
                        var user = '~';
                        if (opts && opts.username){
                                user = opts.username;
                        }
			var optionsList = buildOptionsList('/mobile/platform/users/' + user, opts, httpOptions);
			optionsList.json = newFields;
		    return utils().wrapMCSResult(rest.putAsync(optionsList));
        }
	}, {});
	function buildOptionsList(uri, opts, httpOptions){
		var optionsList = utils().buildOptionsList(uri, opts, httpOptions);
		// query parameters
		if (opts){
			if (!optionsList.qs){
				optionsList.qs = {};
			}
			
			if (opts.fields){
				optionsList.qs.fields = opts.fields;
			}
		}
		return optionsList;
	}

};
