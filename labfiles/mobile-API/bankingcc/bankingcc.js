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
module.exports = function(service,config) {

  var logger = (config ? config.logger : null);
  if (!logger) {
    const log4js = require('log4js');
    logger = log4js.getLogger();
    logger.setLevel('INFO');
    log4js.replaceConsole(logger);
  }
  if (config){
    config.logger = logger;
  }

 // Reference component shell
  var shell = require('./shell')(config);
  
  /**
	 * Retrieves metadata for components implemented by this service.
	 */
	service.get('/mobile/custom/BankingCC/components', function(req,res) {
    res.set('Content-Type', 'application/json')
       .status(200)
       .json(shell.getAllComponentMetadata());
	});

	service.post('/mobile/custom/BankingCC/components/:componentName', function(req,res) {
    const componentName = req.params.componentName;

    shell.invokeComponentByName(req.params.componentName, req.body, {'mobileSdk': req.oracleMobile}, function(err, data) {
        if (!err) {
            res.status(200).json(data);
        }
        else {
            switch (err.name) {
                case 'unknownComponent':
                    res.status(404).send(err.message);
                    break;
                case 'badRequest':
                    res.status(400).json(err.details);
                    break;
                default:
                    res.status(500).json(err.details);
                    break;
            }
        }
    });
	});

};
