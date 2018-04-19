/**
 * The ExpressJS namespace.
 * @external ExpressApplicationObject
 * @see {@link http://expressjs.com/3x/api.html#app}
 */ 

/**
 * Mobile Cloud custom code service entry point.
 * @param {external:ExpressApplicationObject}
 * service 
 */
module.exports = function(service) {


	/**
	 *  The file samples.txt in the archive that this file was packaged with contains some example code.
	 */

	service.get('/mobile/custom/OracleMobileAPI/ping', function(req,res) {
		var result = {};
		var statusCode = 200;
		if (statusCode == 200){
			var acceptType = req.accepts(['application/json']);
			if (acceptType == 'application/json'){
				result = [
					  {
					    "componentName": "NEW_API",
					    "channels": {
					      "facebook": "1.0"
					    },
					    "componentProperties": {
					      "variable": { "type": "string", "required": true }
					    }				    
					  }
					];
			}			
		}
		res.status(statusCode).send(result);
	});

	service.delete('/mobile/custom/OracleMobileAPI/kill', function(req,res) {
		var result = {};
		var statusCode = 200;
		res.status(statusCode).send(result);
	});

	service.options('/mobile/custom/OracleMobileAPI/rest', function(req,res) {
		var result = {};
		var statusCode = 200;
		res.status(statusCode).send(result);
	});

	service.get('/mobile/custom/OracleMobileAPI/rest', function(req,res) {
		var result = {};
		var statusCode = 200;
		res.status(statusCode).send(result);
	});

	service.post('/mobile/custom/OracleMobileAPI/rest', function(req,res) {
		var result = {};
		var statusCode = 201;
		res.status(statusCode).send(result);
	});

	service.delete('/mobile/custom/OracleMobileAPI/rest', function(req,res) {
		var result = {};
		var statusCode = 200;
		res.status(statusCode).send(result);
	});

	service.put('/mobile/custom/OracleMobileAPI/rest', function(req,res) {
		var result = {};
		var statusCode = 200;
		res.status(statusCode).send(result);
	});

	service.head('/mobile/custom/OracleMobileAPI/rest', function(req,res) {
		var result = {};
		var statusCode = 200;
		res.status(statusCode).send(result);
	});

};
