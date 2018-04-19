var utils = require("./utils");
var Promise = require("bluebird");

var baseCollectionsURI = '/mobile/platform/storage/collections/';

module.exports = function(rest) {

    return Object.create({
		getCollections: function(opts, httpOptions){
			var options = buildOptionsList(baseCollectionsURI, opts, httpOptions);
			return utils().wrap(rest, 'get', options, opts);
		},

		getCollection: function(collection, opts, httpOptions){
			var options = buildOptionsList(buildBaseCollectionURI(collection), opts, httpOptions);
			return utils().wrap(rest, 'get', options, opts);
		},
 
                doesCollectionExist: function(collection, opts, httpOptions){
                        return utils().wrapMCSResult(rest.headAsync(buildOptionsList(buildBaseCollectionURI(collection), opts, httpOptions))).then(
                                function(result){
                                            if (result.statusCode == 200){
                                                    return Promise.resolve({result: true, statusCode: 200})
                                            }
                                            return Promise.resolve({result: false, statusCode: result.statusCode});
                                },
                                function(error){
                                        if (error.statusCode){
                                                if (error.statusCode == 404){
                                                        return Promise.resolve({result: false, statusCode: 200})
                                                }
                                                return Promise.resolve({result: false, statusCode: error.statusCode});
                                        }
                                        return Promise.resolve({result: false, statusCode: 500});

                                }
                        );
                },

		getAll: function(collection, opts, httpOptions){
			var options = buildOptionsList(buildCollectionObjectsURI(collection), opts, httpOptions);
			return utils().wrap(rest, 'get', options, opts);
		},

		getById: function(collection, id, opts, httpOptions){
			var options = buildOptionsList(buildCollectionObjectsURI(collection, id), opts, httpOptions);
			return utils().wrap(rest, 'get', options, opts);
		},

		doesExist: function(collection, id, opts, httpOptions){
			var options = buildOptionsList(buildCollectionObjectsURI(collection, id), opts, httpOptions);
			if (opts && opts.outType === 'stream'){
				return utils().wrap(rest, 'head', options, opts);
			} else {
				return utils().wrap(rest, 'head', options, opts).then(
					function(result){
						if (result.statusCode){
							if (result.statusCode == 200){
								return Promise.resolve({result: true, statusCode: 200})
							}
							return Promise.resolve({result: false, statusCode: result.statusCode});
						}
						return Promise.resolve({result: false});
					}
				);
			}
		},
		
		store: function(collection, object, opts, httpOptions){
			var options = buildOptionsList(buildCollectionObjectsURI(collection), opts, httpOptions);
			options.body = object;
			return utils().wrap(rest, 'post', options, opts);
		},

		storeById: function(collection, id, object, opts, httpOptions){
			var options = buildOptionsList(buildCollectionObjectsURI(collection, id), opts, httpOptions);
			options.body = object;
			return utils().wrap(rest, 'put', options, opts);
		},
		
		remove: function(collection, id, opts, httpOptions){
			var options = buildOptionsList(buildCollectionObjectsURI(collection, id), opts, httpOptions);
			return utils().wrap(rest, 'delete', options, opts);
		}

	}, {});

	function buildCollectionObjectsURI(collection, id){
		if (id){
			return buildBaseCollectionURI(collection) + '/objects/' + id;
		} else {
			return buildBaseCollectionURI(collection) + '/objects';
		}
	}

	function buildBaseCollectionURI(collection){
		return baseCollectionsURI + collection;
	}

	function buildOptionsList(uri, opts, httpOptions){
		var optionsList = utils().buildOptionsList(uri, opts, httpOptions);
		// query parameters
		if (opts){
			if (!optionsList.qs){
				optionsList.qs = {};
			}
			if (opts.offset){
				optionsList.qs.offset = opts.offset;
			}
			if (opts.limit){
				optionsList.qs.limit = opts.limit;
			}
			if (opts.totalResults){
				optionsList.qs.totalResults = opts.totalResults;
			}
            if (opts.encodeURI){
                optionsList.encodeURI = true;
            }

			if (opts.user){
                if (optionsList.encodeURI){
                    optionsList.qs.user = encodeURIComponent(opts.user);
                } else {
                    optionsList.qs.user = opts.user;
                }
			}
            if (opts.orderBy){
                if (optionsList.encodeURI){
                    optionsList.qs.orderBy = encodeURIComponent(opts.orderBy);
                } else {
                    optionsList.qs.orderBy = opts.orderBy;
                }

            }
            if (opts.q){
                optionsList.qs.q = opts.q;
            }


			// headers
			if (opts.sync){
				optionsList.headers['Oracle-Mobile-Sync-Agent'] = opts.sync;
			}
			if (opts.ifMatch){
				optionsList.headers['If-Match'] = opts.ifMatch;
			}
			if (opts.ifNoneMatch){
				optionsList.headers['If-None-Match'] = opts.ifNoneMatch;
			}
			if (opts.ifModifiedSince){
				optionsList.headers['If-Modified-Since'] = opts.ifModifiedSince;
			}
			if (opts.ifUnmodifiedSince){
				optionsList.headers['If-Unmodified-Since'] = opts.ifUnmodifiedSince;
			}
			if (opts.range){
				optionsList.headers['Range'] = opts.range;
			}
			if (opts.contentDisposition){
				optionsList.headers['Oracle-Mobile-Content-Disposition'] = opts.contentDisposition;
			}
            if (opts.mobileName){
                if (optionsList.encodeURI){
                    optionsList.headers['Oracle-Mobile-Name'] = encodeURIComponent(opts.mobileName);

                } else {
                    optionsList.headers['Oracle-Mobile-Name'] = opts.mobileName;

                }
            }

		}
		return optionsList;
	}

};
