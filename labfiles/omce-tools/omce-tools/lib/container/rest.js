/**
 * This library is part of the Custom Code SDK.  It is used to expose rest functionality withing MCS.
 * Most functions of MCS are exposed as internal REST endpoints.  This library provides get, put, post and del functions
 * that allow access to the internal endpoints.  Endpoints are accessed through the fragment of the URI provided in the UI
 *
 * Offline version.
 **/
var querystring = require('querystring');
var Promise = require("bluebird");
Promise.onPossiblyUnhandledRejection(function(error){
    throw error;
});
Promise.longStackTraces();
var request = Promise.promisifyAll(require("request"));

var oldRequestJson = request.Request.prototype.json;

request.Request.prototype.json = function (val) {
    var self = this;

    var headerAtStart = self.hasHeader('content-type');

    oldRequestJson.call(this, val);
  
    var header = self.getHeader('content-type');
    if (!headerAtStart && header && header == 'application/json'){
	    self.setHeader('content-type', 'application/json;charset=utf-8')
    }

    return this
}

function rest(internalParams) {
	    
    var restInstance = Object.create({

		/**
		 * Summary:
		 *		invoke a service
		 * optionsList: Object
		 * 		provide path,body,headers
		 * handler: function
		 * 		handle http response
		 *  
		 * errHandler: function
		 * 		error handler for http request 
		 * 
		 **/
		get: function(optionsList,handler){
			return buildRequest('get', cloneOptions(optionsList), handler)
		},

		getAsync: function(optionsList){
			return buildRequestAsync('get', cloneOptions(optionsList))
		},

		/**
		 * Summary:
		 *		invoke a http options method
		 * optionsList: Object
		 * 		provide path,body,headers
		 * handler: function
		 * 		handle http response
		 *  
		 * errHandler: function
		 * 		error handler for http request 
		 * 
		 **/
		options: function(optionsList,handler){
			return buildRequest('options', cloneOptions(optionsList), handler)
		},
				
		optionsAsync: function(optionsList){
			return buildRequestAsync('options', cloneOptions(optionsList))
		},
		
		/**
		 * Summary:
		 *		invoke the HTTP HEAD method
		 * optionsList: Object
		 * 		provide path,body,headers
		 * handler: function
		 * 		handle http response
		 *  
		 * errHandler: function
		 * 		error handler for http request 
		 * 
		 **/
		head: function(optionsList,handler){
			return buildRequest('head', cloneOptions(optionsList), handler)
		},

		headAsync: function(optionsList){
			return buildRequestAsync('head', cloneOptions(optionsList))
		},
		
		/**
		 * Summary:
		 *		invoke a service
		 * optionsList: Object
		 * 		provide path,json or body,headers
		 * handler: function
		 * 		handle http response
		 *  
		 * errHandler: function
		 * 		error handler for http request 
		 * 
		 **/
		put: function(optionsList,handler){
			return buildRequest('put', cloneOptions(optionsList), handler)
		},

		putAsync: function(optionsList){
			return buildRequestAsync('put', cloneOptions(optionsList))
		},
		
		/**
		 * Summary:
		 *		invoke a service
		 * optionsList: Object
		 * 		provide path,json or body,headers
		 * handler: function
		 * 		handle http response
		 *  
		 * errHandler: function
		 * 		error handler for http request 
		 * 
		 **/
		post: function(optionsList,handler){
			return buildRequest('post', cloneOptions(optionsList), handler)
		},

		postAsync: function(optionsList){
			return buildRequestAsync('post', cloneOptions(optionsList))
		},

		/**
		 * Summary:
		 *		invoke a service
		 * optionsList: Object
		 * 		provide path,json or body,headers
		 * handler: function
		 * 		handle http response
		 *  
		 * errHandler: function
		 * 		error handler for http request 
		 * 
		 **/
		patch: function(optionsList,handler){
                        var newOptionsList = cloneOptions(optionsList);
			if (!newOptionsList.headers){
				newOptionsList.headers = {};
			}
			newOptionsList.headers["X-HTTP-Method-Override"] = "PATCH";
			return this.post(newOptionsList, handler);
		},

		patchAsync: function(optionsList){
                       var newOptionsList = cloneOptions(optionsList);
                        if (!newOptionsList.headers){
                                newOptionsList.headers = {};
                        }
                       newOptionsList.headers["X-HTTP-Method-Override"] = "PATCH";
			return this.postAsync(newOptionsList);
		},
			
		/**
		 * Summary:
		 *		invoke a service
		 * optionsList: Object
		 * 		provide path,body,headers
		 * handler: function
		 * 		handle http response
		 *  
		 * errHandler: function
		 * 		error handler for http request 
		 * 
	     **/	
		del: function(optionsList,handler){
			return buildRequest('delete', cloneOptions(optionsList), handler)
		},
		
		delAsync: function(optionsList){
			return buildRequestAsync('delete', cloneOptions(optionsList))
		},
        
		deleteAsync: function(optionsList){
			return buildRequestAsync('delete', cloneOptions(optionsList))
		}
        
	});

        function cloneOptions(optionsList){
            var newOptionsList = {};
            for (var i in optionsList){
                if (optionsList.hasOwnProperty(i)){ 
                    newOptionsList[i] = optionsList[i];
                }
            }
            return newOptionsList;
        }

	function buildRequest(verb, optionsList, handler){
		return requestPlus(populateOptions(verb, optionsList),internalParams,handler);
	}

	function buildRequestAsync(verb, optionsList){
		return requestPlusAsync(populateOptions(verb, optionsList),internalParams);
	}

	function populateOptions(verb, optionsList){
		if(!optionsList.uri){
			throw new Error("You must specify the uri when making a call from custom code.");
		}
		return populateBasicOptions(verb, optionsList,internalParams);
	}

	//--------------------------
	//putting this directly so that these methods do not become public methods

	function populateHeaders(userSuppliedHeaders, uri, options){
		var headerList = {};
		
		processVersion(uri, headerList);
		if (userSuppliedHeaders){
			for (var headerName in userSuppliedHeaders){
				headerList[headerName.toLowerCase()] =  userSuppliedHeaders[headerName];
			}
		}
		var versionSpecified = checkForOracleMobileAPIVersion(uri, headerList);
		if (!versionSpecified){
			throw new Error("Target version for " + uri + " not specified in custom code. When you call custom code or a connector from within custom code, you must specify the target version either in the oracleMobile section of your package.json or in the http header: oracle-mobile-api-version.");
		}
		return headerList;
	}

    function populateBasicOptions(method,optionsList,options){
        if (!options['OracleMobileAPI-url']){
            throw new Error('cannot use oracleMobile.rest apis without defining \"OracleMobileAPI-url\" in mcs.json. See the warning logged at the start up explaining how to set it.');
        }
        var mcsOptionsList = {
            uri: options['OracleMobileAPI-url'] + '/rest',
            method: method,
            headers: {authorization: options.authorization, 'oracle-mobile-backend-id': options.mobile_backend_id},
        };

        var headerPrefix = 'oracle-offline-header-';
        var needContextType = true;
        optionsList.headers = populateHeaders(optionsList.headers, optionsList.uri, options);
        for (var headerName in optionsList.headers){
            if (headerName === 'context-type') {
                mcsOptionsList.headers[headerName] =  optionsList.headers[headerName];
                needContextType = false;
            } else {
                mcsOptionsList.headers[headerPrefix + headerName] =  optionsList.headers[headerName];
            }
        }

        if (optionsList.encoding !== undefined) {
            mcsOptionsList.encoding = optionsList.encoding;
        }
        if (optionsList.timeout !== undefined) {
            mcsOptionsList.timeout = optionsList.timeout;
        }
        if (optionsList.json){
            mcsOptionsList.json = optionsList.json;
            needContextType = false;
        }
        if (optionsList.body !== undefined){
            mcsOptionsList.body = optionsList.body;
        } else {
            needContextType = false;
        }
        var stringOptionPrefix = 'oracle-offline-option-string-';
        var objectOptionPrefix = 'oracle-offline-option-object-';
        for (var key in optionsList){
            if (key == 'body' || key == 'json' || key == 'headers'){
                // Already done. Ignore
            } else {
                var value = optionsList[key];
                if (typeof value == 'string'){
                    mcsOptionsList.headers[stringOptionPrefix + key] = value;
                } else if (value != undefined) {
                    value = JSON.stringify(value);
                    mcsOptionsList.headers[objectOptionPrefix + key] = value;
                }
            }
        }
        if (needContextType){
            var isText = false;
            if (typeof optionsList.body === 'string'){
                isText = true;
            } else if (Array.isArray(optionsList.body)){
                isText = true;
                for (var index in optionsList.body){
                    if (typeof optionsList.body[index] != 'string'){
                        isText = false;
                        break;
                    }
                }
            } else if (Buffer.isBuffer(optionsList.body)){
                // is there any way to figure out whether the buffer contains binary or text?
            }
            if (isText){
                mcsOptionsList.headers['content-type'] = 'text/plain';
            } else {
                mcsOptionsList.headers['content-type'] = 'application/octet-stream';
            }
        }

		return mcsOptionsList;
	}

	function processVersion(uri, userSuppliedHeaders) {
		var packageJson = internalParams.packageJson;
		if (packageJson.oracleMobile && packageJson.oracleMobile.dependencies){
			if (uri.toLowerCase().indexOf("/mobile/custom") == 0 && packageJson.oracleMobile.dependencies.apis){
				for (var apiName in packageJson.oracleMobile.dependencies.apis){
					if (uri.toLowerCase().indexOf(apiName.toLowerCase()) == 0){
						userSuppliedHeaders["oracle-mobile-api-version"] = packageJson.oracleMobile.dependencies.apis[apiName];
					}
				}
			} else if (uri.toLowerCase().indexOf("/mobile/connector") == 0 && packageJson.oracleMobile.dependencies.connectors){
				for (var connectorName in packageJson.oracleMobile.dependencies.connectors){
					if (uri.toLowerCase().indexOf(connectorName.toLowerCase()) == 0){
						userSuppliedHeaders["oracle-mobile-api-version"] = packageJson.oracleMobile.dependencies.connectors[connectorName];
					}
				}
			}
		}
	}

	function checkForOracleMobileAPIVersion(uri, headers){
		if ((uri.toLowerCase().indexOf("/mobile/custom") != 0) && (uri.toLowerCase().indexOf("/mobile/connector") != 0)){
			return true;
		}
		if (headers){
			for (var key in headers){
				if (key.toLowerCase() === "oracle-mobile-api-version" && headers[key]){
					return true;
				}
			}
		}
		return false;
	}

	
	function requestPlus(callOptions, options, callback) {
		callOptions.__oracle_mobile_cc_ignore_proxy = true;
		return request(callOptions,callback);	
	}

	function requestPlusAsync(callOptions, options) {
		// need to cache rid here because childCount could be incremented by another rest call during traceRequest
		var rid = options.rid + ':' + options.childCount;
		callOptions.__oracle_mobile_cc_ignore_proxy = true;
		var updatedOptions = {};
		for (var key in callOptions) {
			updatedOptions[key] = callOptions[key];
		}

		switch(callOptions.method){
			case 'get':
				return request.getAsync(updatedOptions);
				break;
			case 'put':
				return request.putAsync(updatedOptions);
				break;
			case 'post':
				return request.postAsync(updatedOptions);
				break;
			case 'options':
				return request.optionsAsync(updatedOptions);
				break;
			case 'head':
				return request.headAsync(updatedOptions);
				break;
			case 'delete':
				return request.delAsync(updatedOptions);
				break;
			default:
				return request.getAsync(updatedOptions);
		}
	}


    restInstance['delete'] = restInstance['del'];
    return restInstance;
}

module.exports = rest;
