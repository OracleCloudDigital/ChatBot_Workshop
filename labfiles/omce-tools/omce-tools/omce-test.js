#!/usr/bin/env node

const async = require('async');
const co = require('co');
const prompt = require('prompt');
const program = require('commander');
const fs = require('fs');

const tester = require('./lib/test/testImplementation.js');
const utils = require('./lib/utils.js');

const AUTH_METHODS = ['anonymous', 'basic', 'oauth'];
var descriptorPath;
var testName;

program
    .version('18.1.1')
    .arguments('<configDescriptor>')
    .arguments('<testName>')
    .option('-u, --username <username>', 'The username for basic or OAuth authentication')
    .option('-p, --password <password>', 'The password for basic or OAuth authentication')
    .option('-s, --security [anonymous]', 'Authentication method to use when invoking your API. Valid values are \'anonymous\', \'basic\' or \'oauth\'', 'anonymous')
    .option('-v --verbose', 'Enable verbose logging')
    .action(function(file, test) {
        descriptorPath = file;
        testName = test;
        var username = program.username;
        var password = program.password;
        var authMethod = program.security;
        var verbose = program.verbose || false; // to get a true/false value instead of true/undefined
        co(function *() {

             var descriptor = utils.loadDescriptor(descriptorPath, verbose);
             authMethod = authMethod.toLowerCase();

            if (!AUTH_METHODS.includes(authMethod)) {
                console.error('Error: Invalid security option. The valid values are \'anonymous\', \'basic\' or \'oauth\'.');
                process.exit(1);
            }

            var anonymousKey = descriptor.backend && descriptor.backend.authorization && descriptor.backend.authorization.anonymousKey;
            if (authMethod === 'anonymous' && (anonymousKey === undefined || anonymousKey === false)) {
                console.error('Error: Authentication method is \'anonymous\', but an anonymous key is not defined in toolsConfig.json.');
                process.exit(1);
            }
            descriptor.params.authMethod = authMethod;

            var getUsername = function(callback) {
                if (authMethod === 'basic' || authMethod === 'oauth') {
                    if (!username || username.length === 0) {
                        var userSchema = {
                            name: 'username',
                            description: 'OMCe team member\'s username',
                            message: 'Username is required',
                            required: true
                        };
                        prompt.get([userSchema], function(err, results) {
                            if (err) {
                                callback(err);
                            } else {
                                descriptor.params.username = results.username;
                                callback();
                            }
                        });
                    } else {
                        descriptor.params.username = username;
                        callback();
                    }
                } else {
                    callback();
                }
            };

            var getPassword = function(callback) {
                if (authMethod === 'basic' || authMethod === 'oauth') {
                    if (!password || password.length === 0) {
                        var passwordSchema = {
                            name: 'password',
                            description: 'OMCe team member\'s password',
                            message: 'Password is required.',
                            hidden: true,
                            replace: '*',
                            required: true
                        };
                        prompt.get([passwordSchema], function (err, results) {
                            if (err) {
                                callback(err);
                            } else {
                                descriptor.params.password = results.password;
                                callback();
                            }
                        });
                    } else {
                        descriptor.params.password = password;
                        callback();
                    }
                } else {
                    callback();
                }
            };

            var getTestName = function(callback) {
                var tests = descriptor.tests;
                if (tests === undefined || tests.length === 0) {
                    callback('The descriptor does not contain any test definitions.');
                }
                if (!tests[testName]) {
                    callback('The descriptor does not include a test named ' + testName + '.');
                }
                descriptor.tests.testToExecute = testName;
                callback();
            };

            var getOAuthToken = function(callback) {
                if (descriptor.params.authMethod === 'oauth') {
                    // stash the clientId/clientSecret in params so common code has a common place
                    // to grab them from regardless of which command is being executed.
                    descriptor.params.clientId = descriptor.backend.authorization.clientId;
                    descriptor.params.clientSecret = descriptor.backend.authorization.clientSecret;
                    utils.getOAuthToken(descriptor, callback);
                } else {
                    // noop
                    callback();
                }
            };

            var executeTest = function(callback) {
                try {
                    tester.executeTest(descriptor);
                    callback();
                } catch(err) {
                    callback(err);
                }
            };

            // Do the work. Using async because getUsername & getPassword both include asynchronous
            // operations & this makes it easier to handle the security variants & sequence the operations.
            prompt.start();
            async.series( {
                username: getUsername,
                password: getPassword,
                getOAuthToken: getOAuthToken,
                test: getTestName,
                execute: executeTest }, function(err, results) {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
            });

        });
    })
    .parse(process.argv);

// .action() is not fired if no arguments (.arguments) are passed on cmd-line.
if (typeof descriptorPath === 'undefined') {
    console.error('A test descriptor must be specified.');
} else if (typeof testName === 'undefined') {
    console.error('A test name must be specified.');
}


