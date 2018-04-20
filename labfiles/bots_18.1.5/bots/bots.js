/**
 * The ExpressJS namespace.
 * @external ExpressApplicationObject
 * @see {@link http://expressjs.com/3x/api.html#app}
 */ 
var shell = require('./shell')();
/**
 * Mobile Cloud custom code service entry point.
 * @param {external:ExpressApplicationObject}
 * service 
 */
module.exports = function(service) {


	/**
	 *  The file samples.txt in the archive that this file was packaged with contains some example code.
	 */


	service.get('/mobile/custom/bots/components', function(req,res) {
    res.set('Content-Type', 'application/json')
		.status(200)
		.json(shell.getAllComponentMetadata());
  });

	service.post('/mobile/custom/bots/components/:componentName', function(req,res) {
    const sdkMixin = { oracleMobile: req.oracleMobile };
    console.log("component name = " + req.params.componentName);
    shell.invokeComponentByName(req.params.componentName, req.body, sdkMixin, function(err, data) {
        if (!err) {
            res.status(200).json(data);
        }
        else {
            switch (err.name) {
                case 'unknownComponent':
                    res.status(404).send(err.message);
                    break;
                case 'badRequest':
                    res.status(400).json(err.message);
                    break;
                default:
                    res.status(500).json(err.message);
                    break;
            }
        }
    });
  });

};
