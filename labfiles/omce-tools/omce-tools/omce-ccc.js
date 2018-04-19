#!/usr/bin/env node

//
// Purpose of the wrapper is so we can binary-style commands while allowing for
// parameters, such as --inspect, to be passed to the node container.
//

const fs = require('fs');
const path = require('path');

var mainFile = module.filename;
var mainFilePath = mainFile.slice(0, mainFile.lastIndexOf(path.sep) + 1);


var debug = false;
var verbose = false;

if (process.argv.length < 3) {
    console.error("Error: Required parameter <configDescriptor> is missing");
    process.exit(1);
}
var descriptorPath = process.argv[2];

var i, arg;
for(i=3; i < process.argv.length; i++) {
    arg = process.argv[i];
    if (arg === '--debug') {
        debug = true;
    } else if (arg === '--verbose') {
        verbose = true;
    }
}

try {
    var shell = require("shelljs");
    var cmd = "node";
    if (debug) {
        cmd = cmd + ' --inspect';
    }

    cmd = cmd + ' ' + mainFilePath + "omce-ccc-impl.js " + descriptorPath;
    if (verbose) {
        cmd = cmd + ' --verbose';
        console.log('Command: ' + cmd);
    }
    shell.exec(cmd);
} catch(err) {
    console.error(err);
    process.exit(1);
}
