const _ = require('underscore');
const request = require('request');
const async = require('async');
const utils = require('../utils.js');

module.exports = {

    executeTest: function(descriptor) {

        var testName = descriptor.tests.testToExecute;
        var test = descriptor.tests[testName];
        var requestOptions = {};

        var setBaseUrl = function(callback) {
            requestOptions.url = 'http://localhost:' + descriptor.container.port + '/mobile/custom/';
            callback();
        };

        var setResource = function(callback) {
            var setUriParameters = function(test, resource) {
                if (!resource.includes(':'))
                    return resource;

                // create a dummy object to simplify processing
                if (!test.uriParameters) {
                    test.uriParameters = {};
                }

                var components = _.map(resource.split('/'), function(component) {
                    if (component.startsWith(':')) {
                        var name = component.slice(1);
                        value = test.uriParameters[name];
                        if (!value) {
                            throw 'Value for URI parameter \'' + name + '\' not found. Please correct the test definition.';
                        } else if (value === '<PARAMETER_VALUE>') {
                            throw 'Value for URI parameter \'' + name + '\' has not been set. Please correct the test definition.';
                        } else {
                            return value;
                        }
                    } else {
                        return component;
                    }
                });

                var updatedResource;
                _.each(components, function(component) {
                    updatedResource = updatedResource ? updatedResource + '/' + component : component;
                });
                return updatedResource;
            };

            if (test.resource === undefined) {
                callback('Required parameter \'resource\' is missing or undefined');
            }
            var resource = test.resource;
            if (resource.startsWith('/')) {
                resource = resource.slice(1);
            }
            resource = setUriParameters(test, resource);
            requestOptions.url = requestOptions.url + descriptor.apiName + '/' + resource;
            callback();
        };

        var setMethod = function(callback) {
            var methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];
            if (test.method === undefined) {
                callback('Required parameter \'method\' is missing or undefined');
            }
            var testMethod = test.method.toUpperCase();
            var validMethod = _.find(methods, function (method) {
                return testMethod === method;
            });
            if (validMethod) {
                requestOptions.method = testMethod;
                callback();
            } else {
                callback('\'method\' ' + testMethod + ' is not supported.');
            }
        };

        var setPayload = function(callback) {
            if (requestOptions.method === 'POST' || requestOptions.method === 'PUT' || requestOptions.method === 'PATCH') {
                if (test.payload === undefined) {
                    callback('Required parameter \'payload\' is missing or undefined');
                }
                requestOptions.json = true;
                requestOptions.body = test.payload;
            }
            callback();
        };

        var setHeaders = function(callback) {
            var authHeaderValue;

            var backend = descriptor.backend;
            var params = descriptor.params;
            if (backend === undefined) {
                callback('Required backend parameters are missing or undefined')
            }

            if (backend.backendId === undefined) {
                callback('Required backend parameter \'backendId\' is missing or undefined');
            }

            requestOptions.headers = {};
            requestOptions.headers['oracle-mobile-backend-id'] = backend.backendId;

            if (params.authMethod === 'anonymous' || params.authMethod === undefined) {
                params.authMethod = 'anonymous';
                authHeaderValue = 'Basic ' + backend.authorization.anonymousKey;
            } else if (params.authMethod === 'basic') {
                var base64 = new Buffer(params.username + ':' + params.password, "ascii").toString("base64");
                authHeaderValue = 'Basic ' + base64;
            } else if (params.authMethod === 'oauth') {
                authHeaderValue = 'Bearer ' + params.accessToken;
            } else {
                callback('Unknown authorization method: ' + auth.authMethod);
            }
            utils.verbose(descriptor, 'Authorization: ' + authHeaderValue);
            requestOptions.headers.authorization = authHeaderValue
            callback();
        };

        var submitRequest = function(callback) {
            console.log('Executing test ' + testName + '. Method: ' + requestOptions.method + ', URL: ' + requestOptions.url);
            if (requestOptions.body) {
                console.log('Request payload: \n' + JSON.stringify(requestOptions.body));
            }

            request(requestOptions, function (error, response, body) {
                if (error) {
                    console.log(error);
                    callback('Test ' + testName + ' failed', false);
                } else if (response.statusCode > 201) {
                    if (body) {
                        console.log('Response body: \n' + JSON.stringify(body));
                    }
                    callback('Test ' + testName + ' failed with status ' + response.statusCode);
                } else {
                    if (body) {
                        // Not sure why, but GET requests seem to return JSON body as a string but
                        // put/patch return the body as an object
                        if (typeof body === 'string') {
                            console.log('Response body: \n' + body);
                        } else {
                            console.log('Response body: \n' + JSON.stringify(body));
                        }
                    }
                    console.log('Test ' + testName + ' completed successfully with status ' + response.statusCode);
                    callback();
                }
            })
        };

        // use async because setHeaders may require an async call to obtain an OAuth token and submitRequest is async
        async.series([
            setBaseUrl,
            setResource,
            setMethod,
            setPayload,
            setHeaders,
            submitRequest
        ],
        function (err, results) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    }


};
