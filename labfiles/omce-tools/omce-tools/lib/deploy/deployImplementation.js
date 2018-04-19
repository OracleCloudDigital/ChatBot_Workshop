const _ = require('underscore');
const request = require('request');
const fs = require('fs');
const path = require('path');
const utils = require('../utils.js');

module.exports = {

    deployImplementation: function(descriptor, callback) {
        var tempDir = utils.makeTempDir(descriptor, descriptor.tools.deployment.tempDirectory);
        var zipDestPath = tempDir + descriptor.apiName + '_' + descriptor.apiVersion + '.zip';
        var sourcePath = descriptor.moduleLocation;
        console.log('Packaging implementation for ' + descriptor.apiName + ' v' + descriptor.apiVersion + ' from ' + sourcePath);

        utils.createArchive(descriptor, sourcePath, zipDestPath, descriptor.apiName, _.bind(function() {
            this.postImplementation(descriptor, zipDestPath, callback);
        }, this));
    },

    postImplementation: function(descriptor, zipPath, callback) {
        console.log('Deploying implementation to OMCe');

        var formContents1 = {
            file: fs.createReadStream(zipPath)
        };

        var formOptions1 = {
            url: descriptor.baseUrl + 'mobile/tools/1.0/apis/' + descriptor.apiId + '/implementations',
            method: 'POST',
            formData: formContents1,
            headers: {
                'Authorization': 'Bearer ' + descriptor.params.accessToken
            }
        };

        request.debug = descriptor.verbose;
        request(formOptions1, function (error, response, body) {
            if (error) {
                callback(error);
            } else {
                if (response.statusCode > 201) {
                    var errMsg = "Deployment failed. HTTP return code: " + response.statusCode +
                                "\nResponse: " + body;
                    callback(errMsg);
                } else {
                    console.log('Deployment completed successfully');
                    // TODO - need to dump any unresolved dependencies from the response.
                }
            }

            // clean up temp files/directories
            if (fs.existsSync(zipPath)) {
                fs.unlinkSync(zipPath);
            }
            var tempDir = zipPath.slice(0, zipPath.lastIndexOf(path.sep));
            if (fs.existsSync(tempDir)) {
                fs.rmdirSync(tempDir);
                utils.verbose(descriptor, 'Deleted temp directory ' + zipPath.slice(0, zipPath.lastIndexOf(path.sep)))
            }
            callback();
        })
    }
};
