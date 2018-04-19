var utils = require("./utils");

module.exports = function(rest) {

	return Object.create({

		getProperties: function(httpOptions){
			var optionsList = utils().buildOptionsList('/mobile/platform/appconfig/client', null, httpOptions);
			optionsList.json = true;
			return utils().wrapMCSResult(rest.getAsync(optionsList));
		}
	}, {});

}

