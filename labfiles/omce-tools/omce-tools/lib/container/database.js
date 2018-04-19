var utils = require("./utils");

var baseObjectsURI = '/mobile/platform/database/objects/';
var baseSqlURI = '/mobile/platform/database/sql';

module.exports = function(rest) {

    return Object.create({

        getAll: function(table, opts, httpOptions){
			var optionsList = buildOptionsList(baseObjectsURI + table, opts, httpOptions);
			return utils().wrap(rest, 'get', optionsList, opts);
        },

        get: function(table, keys, opts, httpOptions){
			var uri = baseObjectsURI + table + '/';
                        if (keys){
                                if (Array.isArray(keys)){
                                        for (var i = 0; i<keys.length;i++ ){
                                                uri = uri + keys[i];
                                                if (i < keys.length - 1){
                                                        uri = uri + '/'
                                                }
                                        }
                                } else {
                                        uri = uri + keys;
                                }
                        }

			var optionsList = buildOptionsList(uri, opts, httpOptions);
                    return utils().wrap(rest, 'get', optionsList, opts);
        },

		merge: function(table, object, opts, httpOptions){
			var optionsList = buildOptionsList(baseObjectsURI + table, opts, httpOptions);

            		var newOptsList = buildJsonOptsList(opts);
			optionsList.body = object;
                        return utils().wrap(rest, 'put', optionsList, newOptsList);
        },

		insert: function(table, object, opts, httpOptions){
			var optionsList = buildOptionsList(baseObjectsURI + table, opts, httpOptions);
                        var newOptsList = buildJsonOptsList(opts);
                        optionsList.body = object;
                        return utils().wrap(rest, 'post', optionsList, newOptsList);
        },
		
		delete: function(table, keys, opts, httpOptions){
			var uri = baseObjectsURI + table + '/';
			if (keys){
				if (Array.isArray(keys)){
					for (var i = 0; i<keys.length;i++ ){
						uri = uri + keys[i];
						if (i < keys.length - 1){
							uri = uri + '/'
						}
					}
				} else {
					uri = uri + keys;
				}
			}
			var optionsList = buildOptionsList(uri, opts, httpOptions);
                        return utils().wrap(rest, 'delete', optionsList, opts);

        },
		
        sql: function(query, args, opts, httpOptions){
            var optionsList = buildOptionsList(baseSqlURI, opts, httpOptions);
            optionsList.headers['Oracle-Mobile-SQL'] =
                (optionsList.encodeURI) ? encodeURIComponent(query) : query;
            if (args) {
                optionsList.body = args
            }
            var newOptsList = buildJsonOptsList(opts);
            return utils().wrap(rest, 'post', optionsList, newOptsList);
        }

	}, {});

        function buildJsonOptsList(opts){
               var newOptsList = {};
               if (opts){
                        for (var key in opts) {
                                if(opts.hasOwnProperty(key) ) {
                                        newOptsList[key] = opts[key];
                                }
                        }
                }
                if (!newOptsList.inType){
                        newOptsList.inType = 'json';
                }
                if (!newOptsList.outType){
                        newOptsList.outType = 'json';
                }
		return newOptsList;
	}

	function buildOptionsList(uri, opts, httpOptions){
		var optionsList = utils().buildOptionsList(uri, opts, httpOptions);
		// query parameters
		if (opts){
                        if (opts.filter){
                                optionsList.qs = opts.filter;
                        } else if (!optionsList.qs){
                                optionsList.qs = {};
                        }
                        if (opts.encodeURI){
                            optionsList.encodeURI = true;
                        }

			// headers
                        if (opts.fields){
                                if (optionsList.encodeURI){
                                    optionsList.qs.fields = encodeURIComponent(opts.fields);
                                } else {
                                    optionsList.qs.fields = opts.fields;
                                }
                        }

			if (!optionsList.headers){
				optionsList.headers = {};
			}

			if (opts.extraFields){
                                if (optionsList.encodeURI){
                                    optionsList.headers['Oracle-Mobile-Extra-Fields'] = encodeURIComponent(opts.extraFields);
                                } else {
                                    optionsList.headers['Oracle-Mobile-Extra-Fields'] = opts.extraFields;
                                }

			}

			if (opts.primaryKeys){
                                if (optionsList.encodeURI){
                                    optionsList.headers['Oracle-Mobile-Primary-Keys'] = encodeURIComponent(opts.primaryKeys);
                                } else {
                                    optionsList.headers['Oracle-Mobile-Primary-Keys'] = opts.primaryKeys;    
                                }

			}
		}
		return optionsList;
	}

}