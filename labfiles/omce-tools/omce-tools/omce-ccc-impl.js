#!/usr/bin/env node

const async = require('async');
const co = require('co');
const fs = require('fs');
const program = require('commander');
const request = require('request');

const server = require('./lib/container/mcs-node-server.js');
const utils = require('./lib/utils.js');

var descriptorPath;
program
    .version('18.1.1')
    .arguments('<configDescriptor>')
    .option('-v --verbose', 'Enable verbose logging')
    .action(function(file) {
        descriptorPath = file;
        var verbose = program.verbose;
        co(function *() {

            var descriptor = utils.loadDescriptor(descriptorPath, verbose);
            startContainer(descriptor);

        });
    })
    .parse(process.argv);

// .action() is not fired if no arguments (.arguments) are passed on cmd-line.
if (typeof descriptorPath === 'undefined') {
    console.error('Error: A deployment descriptor must be specified.');
}


function startContainer(descriptor) {

    if (descriptor.backend && descriptor.backend.authorization) {
        if (!descriptor.backend.authorization.anonymousKey) {
            server.start(descriptor);
        } else if (descriptor.backend.authorization.anonymousKey) {
            descriptor.params.accessToken = 'Basic ' + descriptor.backend.authorization.anonymousKey;
            // series will call a set of events in sequence
            async.series([
                function (callback) {
                    pingOracleMobileAPI(descriptor, callback);
                },
                function (callback) {
                    server.start(descriptor);
                }
            ]);
        } else {

            // TODO - handle username/password. Do this in a generic & re-usable way for all modules.

            // series will call a set of events in sequence
            async.series([
                function (callback) {
                    this.pingOracleMobileAPI(descriptor, callback);
                },
                function (callback) {
                    server.start(descriptor);
                }
            ]);
        }
    } else {
        console.log("Starting server: " + descriptor);
        server.start(descriptor);
    }
}

function pingOracleMobileAPI(descriptor, callback) {
    var canPing = descriptor.baseUrl && descriptor.container.oracleMobileApiName &&
                  descriptor.backend.backendId && descriptor.backend.authorization.anonymousKey;
    if (canPing) {
        console.log("Ping OracleMobileAPI to verify that OracleMobileAPI-uri and authorization are correct.");
        var pingOptionsList = {
            uri: descriptor['OracleMobileAPI-url'] + '/ping',
            headers: {
                'oracle-mobile-backend-id': descriptor.backend.backendId,
                authorization: descriptor.params.accessToken
            },
            method: 'get'
        };

        request(pingOptionsList, function (error, response, body) {
            if (error) {
                console.error(descriptor.container.oracleMobileApiName + " ping failed with error:", error);
                process.exit(1);
            } else if (response.statusCode != 200) {
                console.error(descriptor.container.oracleMobileApiName + " ping failed with unexpected response:", response.statusCode, body);
                if (descriptor.backend.authorization.anonymousKey) {
                    console.error("Some of toolsConfig.json properties responsible for connecting to MCS: (\"baseUrl\", \"backend.backendId\", \"backend.authorization.anonymousKey\") are incorrect or login is required for the OracleMobileAPI.");
                } else {
                    console.error("Either some of toolsConfig.json properties responsible for connecting to MCS: (\"baseUrl\", \"backend.backendId\") or the entered user / password pair are incorrect.");
                }
                process.exit(1);
            } else {
                console.log(descriptor.container.oracleMobileApiName + " ping succeeded!");
                callback();
            }
        });
    } else {
        console.error("Error: One or more of the following configuration properties required to connect to MCS is missing or undefined:\n baseUrl, container.oracleMobileApiName, backend.backendId, backend.authorization.anonymousKey");
        process.exit(1);
    }
}
