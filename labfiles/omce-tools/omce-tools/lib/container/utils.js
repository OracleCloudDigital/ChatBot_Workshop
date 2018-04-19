var Promise = require("bluebird");

module.exports = function() {

    return Object.create({
        // if opts.outType === 'stream' returns request, promise otherwise
        wrap: function(rest, verb, options, opts) {
            if (opts){
                if (opts.inType === 'stream' && options.body){
                    var streamIn = options.body;
                    options.body = undefined;
                    if (opts.outType === 'stream'){
                        return streamIn.pipe(rest[verb](options));
                    } else {
                        if ((opts.outType === 'json' && opts.inType !== 'json') || (opts.outType !== 'json' && opts.inType === 'json')){
                            var overrideJson = function(request) {
                                request._json = opts.outType === 'json';
                                return request;
                            };
                            var wrapper = function(optionsList, callback) {
                                streamIn.pipe(overrideJson(rest[verb](optionsList, callback)));
                            }
                            var wrapperAsync = Promise.promisify(wrapper);
                            return wrapMCSResultInternal(wrapperAsync(options));
                        } else {
                            var wrapper = function(optionsList, callback) {
                                streamIn.pipe(rest[verb](optionsList, callback));
                            }
                            var wrapperAsync = Promise.promisify(wrapper);
                            return wrapMCSResultInternal(wrapperAsync(options));
                        }
                    }
                } else {
                    if (opts.outType === 'stream'){
                        return rest[verb](options);
                    } else {
                        if ((opts.outType === 'json' && opts.inType !== 'json') || (opts.outType !== 'json' && opts.inType === 'json')){
                            var overrideJson = function(request) {
                                request._json = opts.outType === 'json';
                                return request;
                            };
                            var wrapper = function(optionsList, callback) {
                                overrideJson(rest[verb](optionsList, callback));
                            }
                            var wrapperAsync = Promise.promisify(wrapper);
                            return wrapMCSResultInternal(wrapperAsync(options));
                        } else if (opts.outType === 'json' && opts.inType === 'json') {
				 options.json = true;
			}
                    }
                }
            }
            return wrapMCSResultInternal(rest[verb + 'Async'](options));
        },
        
        wrapMCSResult: function(request){
            return wrapMCSResultInternal(request);
        },

        createOptionsListWithAuthToken: function(uri, authorization, opts, httpOptions){
            var optionsList = this.buildOptionsList(uri, opts, httpOptions);
            if (!optionsList.headers){
                optionsList.headers = {};
            }
            optionsList.headers['authorization'] = authorization;
            return optionsList;
        },

        buildOptionsList: function(uri, options, httpOptions){
            var newOptionsList = {};
            if (httpOptions){
                for (var key in httpOptions) {
                    if( httpOptions.hasOwnProperty(key) ) {
                        newOptionsList[key] = httpOptions[key];
                    }
                }
            }

            if (!newOptionsList.headers){
                newOptionsList.headers = {};
            }
            if (options){
                if (options.Accept){
                    newOptionsList.headers['Accept'] = options.Accept;
                }
                if (options.contentType){
                    newOptionsList.headers['Content-Type'] = options.contentType;
                }
                if (options.inType){
                    if (options.inType === 'json'){
                        newOptionsList.json = true;
                    }
                }
                if (options.outType){
                    if (options.outType === 'binary'){
                        newOptionsList.encoding = null;
                    } else if (options.outType.encoding){
                        newOptionsList.encoding = options.outType.encoding;
                    }
                }
            }
            newOptionsList.uri = uri;
            return newOptionsList;
        }

    }, {});

function wrapMCSResultInternal(request){
    return request.then(
        function(result){
            var returnValue = {};
                var resultObj = (result[0] || result);
                if (resultObj){
                    if (resultObj.headers){
                        returnValue.headers = resultObj.headers;
                        if (resultObj.headers['content-type']){
                            returnValue.contentType = resultObj.headers['content-type'];
                    }

                        if (resultObj.headers['content-length']){
                            returnValue.contentLength = resultObj.headers['content-length'];
                    }
                }

                    if (resultObj.statusCode){
                        returnValue.statusCode = resultObj.statusCode;
                        if (resultObj.statusCode >= 400){
                            if (resultObj.body){
                                returnValue.error = resultObj.body;
                        }
                        return Promise.reject(returnValue);
                    }
                        if (resultObj.body){
                            returnValue.result = resultObj.body;
                    }
                    return Promise.resolve(returnValue);
                }
            }

            returnValue.error = "unexpected result";
            return Promise.reject(returnValue);

        },
        function(error){
            return Promise.reject({error: error});
        }
    )
}
};
