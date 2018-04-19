/*
 * mcs-node-server - offline version
 * 
 */
exports.start = function(offlineContext) {
    var path = require('path');
    var filepath = path.resolve(process.cwd(), offlineContext.moduleLocation);
    var packageJson = require(filepath + '/package.json');

    var http = require("http");
    var https = require("https");
    var url = require("url");
    var express = require('express');
    var artifact = require(filepath);
    var sdk = require("./sdk");
    var methodOverride = require('method-override');

    function extractParams(headers) {
        var params = {};
        params.packageJson = packageJson;

        if (headers) {
            if (headers["authorization"]) {
                params["authorization"] = headers["authorization"];
            } else if (offlineContext.authorization){
                params["authorization"] = offlineContext.authorization.token;
            }

            if (headers["oracle-mobile-backend-id"]) {
                params["mobile_backend_id"] = headers["oracle-mobile-backend-id"];
            } else if (offlineContext.backend){
                params["mobile_backend_id"] = offlineContext.backend.backendId;
            }

            if (headers["oracle-mobile-backend-name"]) {
                params["backendName"] = headers["oracle-mobile-backend-name"];
            } else if (offlineContext.backend){
                params["backendName"] = offlineContext.backend.backendName;
            }

            if (headers["oracle-mobile-backend-version"]) {
                params["backendVersion"] = headers["oracle-mobile-backend-version"];
            } else if (offlineContext.backend) {
                params["backendVersion"] = offlineContext.backend.backendVersion;
            }
        }
        params['OracleMobileAPI-url'] = offlineContext['OracleMobileAPI-url'];

        return params;
    }

    console.finest = console.log;
    console.finer = console.log;
    console.fine = console.log;
    console.config = console.log;
    console.info = console.log;
    console.warning = console.warn;
    console.severe = console.error;


    if (offlineContext.proxy){
        if (offlineContext.proxy.http){
            var httpProxyAgent = require("http-proxy-agent");
            var httpProxyOptions = {host: offlineContext.proxy.http.host, port: offlineContext.proxy.http.port};

            var _httpRequest = http.request;

            http.request = function(options, callback) {
                var internalOptions;
                if (options){
                    internalOptions = options;
                    // that's what http.request does, therefore we should do the same to correctly process string
                    if (typeof options === 'string') {
                      internalOptions = url.parse(options);
                    }
                } else {
                    internalOptions = {};
                }
                if (!internalOptions.__oracle_mobile_cc_ignore_proxy){
                  if (!internalOptions.agent || internalOptions.agent === http.globalAgent) {
                    internalOptions.agent = httpProxyAgent(httpProxyOptions);
                  }
                }
                return _httpRequest.call(this, internalOptions, callback);
            };
        }

        if (offlineContext.proxy.https){
            var httpsProxyAgent = require("https-proxy-agent");
            var httpsProxyOptions = {host: offlineContext.proxy.https.host, port: offlineContext.proxy.https.port};

            var _httpsRequest = https.request;

            https.request = function(options, callback) {
                var internalOptions;
                if (options){
                    internalOptions = options;
                    // that's what http.request does, therefore we should do the same to correctly process string
                    if (typeof options === 'string') {
                      internalOptions = url.parse(options);
                    }
                } else {
                    internalOptions = {};
                }
                if (!internalOptions.__oracle_mobile_cc_ignore_proxy){
                  if (!internalOptions.agent || internalOptions.agent === https.globalAgent) {
                    internalOptions.agent = httpsProxyAgent(httpsProxyOptions);
                  }
                }
                return _httpsRequest.call(this, internalOptions, callback);
            };
        }
    }

    var port = offlineContext.container.port;

    var configNode = require('./config-node.json');
    var agentJson = configNode["cccvm.node.agent"];
    if (agentJson) {
        var Agent;
        if (agentJson.require && !agentJson.require !== "http") {
            Agent = require(agentJson.require);
        } else {
            Agent = http.Agent;
        }
        http.globalAgent = new Agent(agentJson.options);

        var AgentHttps;
        if (agentJson.requirehttps && !agentJson.requirehttp !== "https") {
            AgentHttps = require(agentJson.requirehttps);
        } else if (agentJson.https) {
            AgentHttps = Agent[agentJson.https];
        } else {
            AgentHttps = https.Agent;
        }
        https.globalAgent = new AgentHttps(agentJson.options);
    }

    function mcsSdk(req, res, next) {
        var internalParams = extractParams(req.headers);
        req.oracleMobile = sdk(internalParams); // sdk module exports a factory function, so this is a new instance each time
        
        next();
    }


    var service = express();
    var bodyParser = require('body-parser');
    service.use(bodyParser.json());
    service.use(bodyParser.urlencoded( {extended: false} ));
    service.use(methodOverride('X-HTTP-Method-Override'));
    service.use(mcsSdk);
    service.disable('etag');
    artifact(service);

    service.listen(port);

    console.log("The Node server is listening at port " + port);
}
