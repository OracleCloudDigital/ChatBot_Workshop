var ums = require('./ums');
var utils = require("./utils");
var token = require("./token");

var notificationURI =  '/mobile/system/notifications/notifications/';

module.exports = function(rest, routing) {

    return Object.create({

        post: function(notification, context, opts, httpOptions){
			var optionsList = buildOptionsList(null, context, opts, httpOptions);
			return getToken(context).then(sendNotification.bind(this, notification,  null, optionsList));
        },

		getById: function(id, context, opts, httpOptions){
			var optionsList = buildOptionsList(null, context, opts, httpOptions);
			return getToken(context).then(getNotification.bind(this, id,  null, optionsList));
		},

		remove: function(id, context, opts, httpOptions){
			var optionsList = buildOptionsList(null, context, opts, httpOptions);
			return getToken(context).then(deleteNotification.bind(this, id, null, optionsList));
		},

		getAll: function(context, opts, httpOptions){
			var optionsList = buildOptionsList(null, context, opts, httpOptions);
			return getToken(context).then(getAllNotifications.bind(this, null, optionsList));
		},
	}, {});

	function mbeEquals(a, b) {
	    return (a.name === b.name) && (a.version === b.version);
	}

	function getToken(context){
		var username;
        if (context){
    		username = context.username;
        }
		// By default - use given MBE name/version

		if (context && context.mbe){
            var ntfBackend = {
                name: context.mbe,
                version: context.version
            };
            // If a given name/version equals to a target MBE name/version -
            // assume MBE wants to operate with own notifications so we need
            // to redirect it to the original (or rerouted) one.
            // Notifications will be sent to self only in case of a direct call
            // (without dynamic MBE routing).
            if (mbeEquals(ntfBackend, routing.targetBackend)) {
                ntfBackend = routing.originalBackend;
            }
        } else {
            ntfBackend = routing.originalBackend;
        }
		// Otherwise we assume that user explicitly operates notifications on a different MBE
		// so we use given values as is.
		return token(rest).getToken(ntfBackend.name, ntfBackend.version, username);
	}

	function sendNotification(notification, opts, httpOptions, authorization){
		var optionsList = utils().createOptionsListWithAuthToken(notificationURI, authorization.result, opts, httpOptions);
		optionsList.json = notification;
		return utils().wrapMCSResult(rest.postAsync(optionsList));
	}

	function getNotification(id, opts, httpOptions, authorization){
		var optionsList = utils().createOptionsListWithAuthToken(notificationURI + id, authorization.result, opts, httpOptions);
		optionsList.json = true;
		return utils().wrapMCSResult(rest.getAsync(optionsList));
	}

	function deleteNotification(id, opts, httpOptions, authorization){
		var optionsList = utils().createOptionsListWithAuthToken(notificationURI + id, authorization.result, opts, httpOptions);
		optionsList.json = true;
		return utils().wrapMCSResult(rest.delAsync(optionsList));
	}

	function getAllNotifications(opts, httpOptions, authorization){
		var optionsList = utils().createOptionsListWithAuthToken(notificationURI, authorization.result, opts, httpOptions);
		optionsList.json = true;
		return utils().wrapMCSResult(rest.getAsync(optionsList));
	}

        function buildOptionsList(uri, context, opts, httpOptions){
                var optionsList = utils().buildOptionsList(uri, opts, httpOptions);
                if (context && context.mbeId){
                	optionsList.headers['Oracle-Mobile-Backend-Id'] = context.mbeId;
		}
		if (opts){
                        if (!optionsList.qs){
                                optionsList.qs = {};
                        }
                        if (opts.q){
                            optionsList.qs.q = opts.q;
                        }
                        if (opts.status){
                                optionsList.qs.status = opts.status;
                        }
                        if (opts.tag){
                                optionsList.qs.tag = opts.tag;
                        }
                        if (opts.sendOnOrAfter){
                                optionsList.qs.sendOnOrAfter = opts.sendOnOrAfter;
                        }
                        if (opts.sendOnOrBefore){
                                optionsList.qs.sendOnOrBefore = opts.sendOnOrBefore;
                        }
                        if (opts.createdOnOrAfter){
                                optionsList.qs.createdOnOrAfter = opts.createdOnOrAfter;
                        }
                        if (opts.createdOnOrBefore){
                                optionsList.qs.createdOnOrBefore = opts.createdOnOrBefore;
                        }
                        if (opts.processedOnOrAfter){
                                optionsList.qs.processedOnOrAfter = opts.processedOnOrAfter;
                        }
                        if (opts.processedOnOrBefore){
                                optionsList.qs.processedOnOrBefore = opts.processedOnOrBefore;
                        }
                        if (opts.orderBy){
                                optionsList.qs.orderBy = opts.orderBy;
                        }
                        if (opts.offset){
                                optionsList.qs.offset = opts.offset;
                        }
                        if (opts.limit){
                                optionsList.qs.limit = opts.limit;
                        }
                }
                return optionsList;
        }

}

