/**
 * This library is part of the Custom Code SDK.  It is used to expose offline functionality.
 * Users of Oracle-client-side libraries can call the setSyncItem and addSyncItem functions to ensure their
 * result is formatted in a manner that is consistent with the Sync library
 * Using this library will not guarantee that the Sync functionality will work on the Client side, it will just
 * ensure compatible formatting.
 **/
function sync() {

	return Object.create({
			/**
			 * Summary:
			 *		adds sync item and switches response into sync item mode.
			 *      this method throwns an error if called with response already in sync collection mode.
			 *      after calling this method both original writing methods on response (write, writeHead, send) 
			 *      and sync collection methods (addSyncItem and setSyncCollectionProperties) would result in an error:
			 *      response is switched into sync item mode and will stay there unless clearSync method is called.
			 * response
			 * 		http response
			 * item
			 * 		sync item to add
			 **/	
		setItem: function(response, item){
			if (!item) {
				throw new Error("sync item is invalid");
			}
			if (!response.sync) {
				response.sync = {"type": "item"};
				sync(response);
			} else {
				if (response.sync.type == "collection") {
					throw new Error("setSyncItem requires sync response type 'item' but sync response type is already set to 'collection' - either addSyncItem or setSyncCollectionProperties has been called before");
				}
			}
			response.sync.body = item;
		},

			/**
			 * Summary:
			 *		adds sync collection item and switches response into sync collection mode (if not already in this mode).
			 *      this method throwns an error if called with response already in sync item mode.
			 *      after calling this method both original writing methods on response (write, writeHead, send)
			 *      and setSyncItem method would result in an error:
			 *      response is switched into sync collection mode and will stay there unless clearSync method is called.
			 * response
			 * 		http response
			 * item
			 * 		sync item to add
			 **/	
		addItem: function(response, item, uri, etag){
			if (!response.sync) {
				response.sync = {"type": "collection"};
				sync(response);
			} else {
				if (response.sync.type == "item") {
					throw new Error("addSyncItem requires sync response type 'collection' but sync response type is already set to 'item' - setSyncItem has been called before");
				}
			}
			if (!response.sync.body) {
				response.sync.body = {};
		    }
			if (!response.sync.body.items) {
				response.sync.body.items = [];
				response.sync.body.uris = [];
				response.sync.body.etags = [];
			}
			response.sync.body.items.push(item);
			response.sync.body.uris.push(uri);
			response.sync.body.etags.push(etag);
		},

			/**
			 * Summary:
			 *		adds sync collection properties and switches response into sync collection mode (if not already in this mode).
			 *      this method throwns an error if called with response already in sync item mode.
			 *      after calling this method both original writing methods on response (write, writeHead, send)
			 *      and setSyncItem method would result in an error:
			 *      response is switched into sync collection mode and will stay there unless clearSync method is called.
			 * response
			 * 		http response
			 * item
			 * 		sync item to add
			 **/	
		setCollectionProperties: function(response, properties) {
			if(properties && (typeof(properties) != "object" || Array.isArray(properties))) {
				throw new Error("properties is invalid");
			}
			if (!response.sync) {
				response.sync = {"type": "collection"};
				sync(response);
			} else {
				if (response.sync.type == "item") {
					throw new Error("setSyncCollectionProperties requires sync response type 'collection' but sync response type is already set to 'item' - setSyncItem has been called before");
				}
			}
			if (!response.sync.body) {
				response.sync.body = {};
		    }
			response.sync.body.properties = properties;
		},

			/**
			 * Summary:
			 *      clears sync mode.
			 *      after calling this method both original writing methods on response (write, writeHead, send)
			 *      and sync methods (setSyncItem, addSyncItem, setSyncCollectionProperties) would work again.
			 **/	
		clear: function(response) {
			if (response.sync) {
				response.clearSync();
			}
		}

	}, {});

	
	// overrides response: 
	//   blocks methods used to write untill end method is called, 
	//   ensures that end method writes out sync stuff.
	function sync(response, syncResponse) {
		response.originalSend = response.send;
		response.send = function() {
			throw new Error("cannot use send method while response is in sync mode (setSyncItem or addSyncItem or setSyncCollectionProperties has been called before");
		};
		response.originalWrite = response.write;
		response.write = function() {
			throw new Error("cannot use write method while response is in sync mode (setSyncItem or addSyncItem or setSyncCollectionProperties has been called before");
		};
		response.originalWriteHead = response.writeHead;
		response.writeHead = function() {
			throw new Error("cannot use writeHead method while response is in sync mode (setSyncItem or addSyncItem or setSyncCollectionProperties has been called before");
		};
		response.clearSync = function() {
			this.sync = null;
			this.send = this.originalSend;
			this.write = this.originalWrite;
			this.writeHead = this.originalWriteHead;
			this.end = this.originalEnd;
		};
		response.originalEnd = response.end;
		response.end = function(data, encoding) {
			var body = JSON.stringify(this.sync.body, null, '\t');
			this.setHeader('Oracle-Mobile-Sync-Resource-Type', this.sync.type);
			this.setHeader('Content-Type', 'application/json');
			this.clearSync();
			this.end(body, encoding);
		};
	}


}

module.exports = sync;
