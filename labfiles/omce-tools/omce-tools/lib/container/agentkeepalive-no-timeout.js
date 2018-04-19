/**
 * agentkeepalive - but without setting timeout on sockets being used, still setting the same timeout on free sockets.
 */

var agentkeepalive = require('agentkeepalive');
var http = require('http');
var https = require('https');
var util = require('util');
var OriginalHttpsAgent = https.Agent;

var debug;
if (process.env.NODE_DEBUG && /agentkeepalive-no-timeout/.test(process.env.NODE_DEBUG)) {
  debug = function (x) {
    console.error.apply(console, arguments);
  };
} else {
  debug = function () { };
}

var Agent = function(options) {
  agentkeepalive.call(this, options);
  this.dummyTimeout = function() {
	  // Nothing to do
  };
};

util.inherits(Agent, agentkeepalive);
module.exports = Agent;

/**
 * Both cached and newly created sockets have socket._maxKeepAliveTimeout (set by agentkeepalive), which we want to remove.
 * Adding a dummyTimeout before that is necessary because handler of "free" event (a huge method I don't want to override)
 * requires array of timeouts to re-set socket._maxKeepAliveTimeout, which we still want to be set in a cached free socket.
 * Note that because timeout is removed AFTER dummyTimeout is added dummyTimeout is deactivated (won't fire).
 * It could be re-activated though if another timeout is set (likely by http.ClientRequest) - but dummyTimeout does nothing anyway.
 */
Agent.prototype.fixTimeout = function(socket) {
	socket.setTimeout(86400000, this.dummyTimeout);
	socket.setTimeout(0, socket._maxKeepAliveTimeout);
	debug('fixTimeout: socket._events.timeout is an array with a single element: ' + (Array.isArray(socket._events.timeout) && socket._events.timeout.length == 1));
	return socket;
};

/**
 * Copied from agentkeepalive. The only change is applying fixTimeout to both newly created and cached sockets.
 */
Agent.prototype.addRequest = function(req, options) {
  // Legacy API: addRequest(req, host, port, path)
  if (typeof options === 'string') {
    options = {
      host: options,
      port: arguments[2],
      path: arguments[3]
    };
  }

  var name = this.getName(options);
  if (!this.sockets[name]) {
    this.sockets[name] = [];
  }

  var freeLen = this.freeSockets[name] ? this.freeSockets[name].length : 0;
  var sockLen = freeLen + this.sockets[name].length;

  if (freeLen) {
    // we have a free socket, so use that.
    var socket = this.fixTimeout(this.freeSockets[name].shift());
    debug('have free socket');

    // don't leak
    if (!this.freeSockets[name].length)
      delete this.freeSockets[name];

    socket.ref && socket.ref();
    req.onSocket(socket);
    this.sockets[name].push(socket);
  } else if (sockLen < this.maxSockets) {
    debug('call onSocket', sockLen, freeLen);
    // If we are under maxSockets create a new one.
    req.onSocket(this.fixTimeout(this.createSocket(req, options)));
  } else {
    debug('wait for socket');
    // We are over limit so we'll add it to the queue.
    if (!this.requests[name]) {
      this.requests[name] = [];
    }
    this.requests[name].push(req);
  }
};

/**
 * Copied from agentkeepalive with no changes - now HttpsAgent inherits from the patched agent.
 */
function HttpsAgent(options) {
    Agent.call(this, options);
    this.defaultPort = 443;
    this.protocol = 'https:';
    this.maxCachedSessions = this.options.maxCachedSessions;
    if (this.maxCachedSessions === undefined)
        this.maxCachedSessions = 100;

    this._sessionCache = {
        map: {},
        list: []
    };
};

util.inherits(HttpsAgent, Agent);

[
    'createConnection',
    'getName',
    '_getSession',
    '_cacheSession',
    // https://github.com/nodejs/node/pull/4982
    '_evictSession',
].forEach(function(method) {
    if (typeof OriginalHttpsAgent.prototype[method] === 'function') {
        HttpsAgent.prototype[method] = OriginalHttpsAgent.prototype[method];
    }
});

Agent.HttpsAgent = HttpsAgent;
