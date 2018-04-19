const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const _ = require('underscore');

module.exports = {

    getOAuthToken: function(descriptor, callback) {
        const qs = require('querystring');
        const request = require('request');
        request.debug = descriptor.verbose;

        this.validateOAuthConfig(descriptor);
        var clientId = descriptor.params.clientId;
        var clientSecret = descriptor.params.clientSecret;
        var username = descriptor.params.username;
        var password = descriptor.params.password;
        var requestOptions = {};
        requestOptions.method = 'POST';
        requestOptions.url = descriptor.tokenEndpoint;

        console.log('Requesting OAuth token...');
        this.verbose(descriptor, 'ClientID: ' + clientId);
        this.verbose(descriptor, 'ClientSecret: ' + clientSecret);
        var authBuffer = new Buffer(clientId + ':' + clientSecret);
        var base64 = authBuffer.toString('base64');
        this.verbose(descriptor, 'Unencoded auth string: ' + authBuffer.toString());
        this.verbose(descriptor, 'Base64 encoded: ' + base64);
        requestOptions.headers = {
            'Authorization': 'Basic ' + base64,
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        };

        var scope = (descriptor.baseUrl.endsWith('/') ? descriptor.baseUrl.slice(0, descriptor.baseUrl.length - 1) : descriptor.baseUrl) +
                    'urn:opc:resource:consumer::all';
        this.verbose(descriptor, 'OAuth token scope: ' + scope);
        requestOptions.body = 'grant_type=password&username=' +  qs.escape(username) +
                              '&password=' + qs.escape(password) +
                              '&scope=' + qs.escape(scope);
        request(requestOptions, _.bind(function(error, response, body) {
            if (error) {
                throw error;
            } else if (response.statusCode === 200) {
                var tokenInfo = JSON.parse(body);
                this.verbose(descriptor, "OAuth Access token: \n" + tokenInfo.access_token);
                this.verbose(descriptor, '');
                descriptor.params.accessToken = tokenInfo.access_token;
                callback();
            } else {
                throw 'Unable to obtain OAuth token: \n' + JSON.stringify(response);
            }
        }, this));
    },

    validateOAuthConfig: function(descriptor) {
        if (descriptor.params) {
            if (!descriptor.tokenEndpoint) {
                throw 'Required configuration parameter \'tokenEndpoint\' is missing or undefined';
            }
            if (!descriptor.params.clientId) {
                throw 'Required configuration parameter \'clientId\' is missing or undefined';
            }
            if (!descriptor.params.clientSecret) {
                throw 'Required configuration parameter \'clientSecret\' is missing or undefined';
            }
            if (!descriptor.params.username) {
                throw 'Required input parameter \'username\' is missing or undefined';
            }
            if (!descriptor.params.password) {
                throw 'Required input parameter \'password\' is missing or undefined';
            }
        } else {
            throw '[validateOAuthConfig] Required authorization parameters are missing.'
        }
    },

    validateConfig: function(descriptor, descriptorPath, metadata) {

        if (metadata) {
            if (descriptor.verbose) {
                console.log('Tools configuration:');
                console.dir(descriptor);
                console.log();
            }

            var fullKey;
            var errors = [];
            var warnings = [];
            this.validateDescriptorKeys(descriptor, metadata, errors, warnings, fullKey);

            for (var index in errors) {
                console.error('\nError: ' + errors[index].message);
                console.error(errors[index].detail);
                console.error(errors[index].example);
            }

            for (var index in warnings) {
                console.warn('\nWarning: ' + warnings[index].message);
                if (descriptor.verbose) {
                    if (warnings[index].detail) {
                        console.warn(warnings[index].detail);
                    }
                    if (warnings[index].example) {
                        console.warn(warnings[index].example);
                    }
                }
            }

            if ((errors.length > 0 || warnings.length > 0 ) && !descriptor.verbose) {
                console.log('\nTo display help and examples associated with warnings, use the --verbose option');
            }

            if (errors.length > 0) {
                console.log('\nError: Found ' + errors.length + 'errors in tools configuration. Please correct and try again.');
                process.exit(1);
            }
        }
    },

    validateDescriptorKeys: function(current, currentDoc, errors, warnings, fullKey, key) {
        if (currentDoc.metainfo) {
            var metainfos = currentDoc.metainfo;
            if (!Array.isArray(metainfos)) {
                metainfos = [currentDoc.metainfo];
            }
            for (var metainfoIndex in metainfos) {
                var metainfo = metainfos[metainfoIndex];
                if (current === metainfo.value) {
                    var message, detail, example;
                    if (metainfo.doc) {
                        if (typeof current === 'string') {
                            message = 'Configuration property \"' + fullKey + '\" is \"' + current + '\"';
                        } else {
                            message = 'Configuration property \"' + fullKey + '\" is ' + current;
                        }
                        detail = metainfo.doc;
                    }
                    if (metainfo.example) {
                        var examples = metainfo.example;
                        if (!Array.isArray(examples)) {
                            examples = [metainfo.example];
                        }
                        for (var index in examples) {
                            example = (example === undefined) ? '' : example;
                            example = example + '\nExample:\n';
                            example = example + '\"' + key + '\": ' + examples[index];
                        }
                    }
                    if (message) {
                        if (metainfo.error) {
                            errors.push({message: message, detail: detail, example: example});
                        } else {
                            warnings.push({message: message, detail: detail, example: example});
                        }
                    }
                    break;
                }
            }
        }
        if (current && typeof current === 'object') {
            for (var nextKey in currentDoc) {
                if (nextKey != 'metainfo') {
                    var nextFullKey;
                    if (!fullKey) {
                        nextFullKey = nextKey;
                    } else {
                        nextFullKey = fullKey + '.' + nextKey;
                    }
                    this.validateDescriptorKeys(current[nextKey], currentDoc[nextKey], errors, warnings, nextFullKey, nextKey);
                }
            }
        }
    },

    createArchive: function(descriptor, sourcePath, destPath, archiveDir, callback) {
        const archiver = require('archiver');

        var zipfile = fs.createWriteStream(destPath);
        var archive = archiver.create('zip');

        zipfile.on('close', _.bind(function () {
            this.verbose('Created archive ' + destPath + ', ' + archive.pointer() + ' total bytes');
            callback();
        }, this));

        archive.on('error', function(err){
            console.log('Error creating archive. sourcePath: ' + sourcePath + ', destPath: ' + destPath + ', archiveDir: ' + archiveDir);
            throw err;
        });

        archive.pipe(zipfile);
        archive.directory(sourcePath, archiveDir);
        archive.finalize();
    },

    makeTempDir: function(descriptor, tempRoot) {
        var tempDirPath;
        while(true) {
            tempDirPath = this.normalizePath(descriptor, tempRoot, true) + this.randomString() + path.sep;
            if (!fs.existsSync(tempDirPath)) {
                fs.mkdirsSync(tempDirPath);
                break;
            }
        }
        this.verbose(descriptor, 'Created temp directory ' + tempDirPath);
        return tempDirPath;
    },

    randomString: function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 6; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },

    verbose: function(descriptor, message) {
        if (descriptor && descriptor.verbose === true) {
            console.log(message);
        }
    },

    loadDescriptor: function(sourcePath, verbose) {
        // load the tools configuration descriptor
        var descriptor;
        var descriptorPath = this.normalizePath(undefined, sourcePath, false);
        if (!fs.existsSync(descriptorPath)) {
            console.error('Error: Tools configuration descriptor \'' + descriptorPath + '\' could not be found.');
            process.exit(1);
        }

        try {
            descriptor = JSON.parse(fs.readFileSync(descriptorPath));
            descriptor.params = {};
            descriptor.verbose = verbose;
            this.verbose(descriptor, 'Loaded tools configuration from ' + descriptorPath);
        } catch(err) {
            console.error('Error: Unable to parse tools configuration from ' + descriptorPath);
            console.error('Error: ' + err);
            process.exit(1);
        }

        // load the tools configuration metadata
        var mainFile = process.mainModule.filename;
        var basePath = mainFile.slice(0, mainFile.lastIndexOf(path.sep) + 1);
        var metadataPath = path.resolve(basePath, 'resource', 'configMetadata.json');
        var metadata;

        if (!fs.existsSync(metadataPath)) {
            console.warn('Warning: configuration metadata \'' + metadataPath + '\' could not be found.');
            process.exit(1);
        }

        try {
            metadata = JSON.parse(fs.readFileSync(metadataPath));
            this.verbose(descriptor, 'Loaded diagnostic metadata from ' + metadataPath);
        } catch(err) {
            console.warn("Warning: Unable to parse configuration metadata " + metadataPath + '');
            process.exit(1);
        }

        this.upgradeConfig(descriptor)
        this.setConfigDefaults(descriptor, descriptorPath, verbose);
        this.validateConfig(descriptor, descriptorPath, metadata);
        return descriptor;
    },

    upgradeConfig: function(descriptor) {
        // create the "backend" config if one does not already exist.
        // if "backend" doesn't exist and can't be created, validation will fail later on
        if (descriptor.authorization && !descriptor.backend) {
            descriptor.backend = {};
            descriptor.backend.backendId = descriptor.authorization.mobileBackendID;
            descriptor.backend.authorization = {};
            descriptor.backend.authorization.anonymousKey = descriptor.authorization.anonymousKey;
            if (descriptor.authorization.oauth) {
                descriptor.backend.authorization.clientId = descriptor.authorization.oauth.clientId;
                descriptor.backend.authorization.clientSecret = descriptor.authorization.oauth.clientSecret;
                if (!descriptor.tokenEndpoint) {
                    descriptor.tokenEndpoint = descriptor.authorization.oauth.tokenEndpoint;
                }
            }
        }

        // create the "tools" config if one does not already exist
        // The "authorization" section cannot be generated because the clientId/clientSecret will
        // not be in the old-style config
        if (descriptor.deploy && !descriptor.tools) {
            descriptor.tools = {};
            descriptor.tools.deployment = {};
            descriptor.tools.deployment.tempDirectory = descriptor.deploy.tempDirectory;
        }
    },

    setConfigDefaults: function(descriptor, descriptorPath) {
        this.setCommonDefaults(descriptor, descriptorPath);
        this.setBackendDefaults(descriptor);
        this.setToolsDefaults(descriptor);
        this.setContainerDefaults(descriptor);
        this.setTestDefaults(descriptor);
    },

    setCommonDefaults: function(descriptor, descriptorPath) {

        // if baseUrl is undefined, the validation will catch it.
        if (descriptor.baseUrl && !descriptor.baseUrl.endsWith('/')) {
            descriptor.baseUrl = descriptor.baseUrl + '/';
        }

        // module location may be specified in the config file or defaulted to the location of the config file.
        if (!descriptor.moduleLocation) {
            // descriptorPath is already normalized
            descriptor.moduleLocation = descriptorPath.slice(0, descriptorPath.lastIndexOf(path.sep) + 1);
        }
        descriptor.moduleLocation = this.normalizePath(descriptor, descriptor.moduleLocation, true);
        this.verbose(descriptor, "Defaulting moduleLocation to " + descriptor.moduleLocation);
    },

    setBackendDefaults: function(descriptor) {
        if (!descriptor.backend) {
            descriptor.backend = {};
        }
        if (!descriptor.backend.authorization) {
            descriptor.backend.authorization = {};
        }
    },

    setToolsDefaults: function(descriptor) {
        if (!descriptor.tools) {
            descriptor.tools = {};
        }
        if (!descriptor.tools.authorization) {
            descriptor.tools.authorization = {};
        }
        if (!descriptor.tools.deployment) {
            descriptor.tools.deployment = {};
        }
        if (!descriptor.tools.deployment.tempDirectory) {
            descriptor.tools.deployment.tempDirectory = os.tmpdir();
            this.verbose(descriptor, "Defaulting deploy.tempDirectory to " + descriptor.tools.deployment.tempDirectory);
        }
        descriptor.tools.deployment.tempDirectory = this.normalizePath(descriptor, descriptor.tools.deployment.tempDirectory, true);
    },

    setContainerDefaults: function(descriptor) {
        if (!descriptor.container) {
            descriptor.container = {};
        }

        if (!descriptor.container.oracleMobileApiName) {
            descriptor.container.oracleMobileApiName = "OracleMobileAPI";
            this.verbose(descriptor, "Defaulting container.oracleMobileApiName to " + descriptor.container.oracleMobileApiName);
        }

        if (!descriptor.container.port) {
            descriptor.container.port = "4000";
            this.verbose(descriptor, "Defaulting container.port to " + descriptor.container.port);
        }

        if (descriptor.baseUrl && descriptor.container.oracleMobileApiName) {
            // assumes setCommonDefaults called first.
            descriptor['OracleMobileAPI-url'] = descriptor.baseUrl + 'mobile/custom/' + descriptor.container.oracleMobileApiName;
        }
    },

    setTestDefaults: function(descriptor) {
        if (!descriptor.tests) {
            descriptor.tests = {};
        }
    },

    normalizePath: function(descriptor, sourcePath, appendSeparator) {
        // convert path to platform-specific separators
        var destPath = this.convertSeparators(descriptor, sourcePath);

        // resolve to an absolute path
        destPath = path.resolve(destPath);

        // add a trailing separator
        if (appendSeparator && !destPath.endsWith(path.sep)) {
            return destPath + path.sep;
        }
        return destPath;
    },

    convertSeparators: function(descriptor, path) {
        // Fixes windows paths to replace POSIX separators ('/') with Windows separators ('/')
        // While not strictly necessary for file operations this does simplify logic that needs to slice paths.
        var normalizedPath = path;
        if (os.platform() === "win32" && path.indexOf("/") > 0) {
            normalizedPath = path.replace("/", "\\");
            this.verbose(descriptor, "Normalized Windows path separators from " + path + " to " + normalizedPath);
        }
        return normalizedPath;
    }
};