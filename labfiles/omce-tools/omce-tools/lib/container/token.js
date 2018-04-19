var utils = require("./utils");

module.exports = function(rest) {

    return Object.create({

        getToken: function(mbe, version, username, opts, httpOptions){
			var optionsList = utils().buildOptionsList('/mobile/platform/ums/tokens/', opts, httpOptions);
			optionsList.json = {
					name: mbe,
					version: version,
					username: username
				};
		    return utils().wrapMCSResult(rest.postAsync(optionsList));
        }
	}, {});

}