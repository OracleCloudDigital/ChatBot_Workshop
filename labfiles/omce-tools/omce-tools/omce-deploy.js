#!/usr/bin/env node

const async = require('async');
const co = require('co');
const prompt = require('prompt');
const program = require('commander');
const fs = require('fs');
const _ = require('underscore');

const deploy = require('./lib/deploy/deployImplementation.js');
const utils = require('./lib/utils.js');

var descriptorPath;
program
    .version('18.1.1')
    .arguments('<configDescriptor>')
    .option('-u, --username <username>', 'Username of an OMCe team member')
    .option('-p, --password <password>', 'Password for the specified user')
    .option('-v --verbose', 'Enable verbose logging')
    .action(function(file) {
        descriptorPath = file;
        var username = program.username;
        var password = program.password;
        co(function *() {

            var descriptor = utils.loadDescriptor(descriptorPath, program.verbose);

            var getUsername = function(callback) {
                if (!username || username.length === 0) {
                    var userSchema = {
                        name: 'username',
                        description: 'Team member username',
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
                    callback()
                }
            };

            var getPassword = function(callback) {
                if (!password || password.length === 0) {
                    var passwordSchema = {
                        name: 'password',
                        description: 'Team member password',
                        message: 'Password is required.',
                        hidden: true,
                        replace: '*',
                        required: true
                    };
                    prompt.get([passwordSchema], function(err, results) {
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
            };

            var getOAuthToken = function(callback) {
                // stash the clientId/clientSecret in params so common code has a common place
                // to grab them from regardless of which command is being executed.
                descriptor.params.clientId = descriptor.tools.authorization.clientId;
                descriptor.params.clientSecret = descriptor.tools.authorization.clientSecret;
                utils.getOAuthToken(descriptor, callback);
            };

            var deployImplementation = function(callback) {
                deploy.deployImplementation(descriptor, callback);
            };

            // Do the work. Using async because getUsername & getPassword both include asynchronous
            // operations & this makes it easier to handle the security variants & sequence the operations.
            prompt.start();
            async.series( {
                username: getUsername,
                password: getPassword,
                getOAuthToken: getOAuthToken,
                execute: deployImplementation
            }, function(err, results) {
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
    console.error('A deployment descriptor must be specified.');
}
