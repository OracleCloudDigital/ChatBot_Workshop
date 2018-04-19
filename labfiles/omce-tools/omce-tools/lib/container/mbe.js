var utils = require("./utils");

module.exports = function(mbeName, mbeVersion, mbeId) {

	return Object.create({

		getMBE: function(){
			return {name: mbeName, version: mbeVersion, id: mbeId};
		}
	}, {});

}

