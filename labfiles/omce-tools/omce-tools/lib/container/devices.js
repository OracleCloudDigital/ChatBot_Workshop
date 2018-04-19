var utils = require("./utils");

var uri = '/mobile/platform/devices/';

module.exports = function(rest) {

    return Object.create({

        register: function(device, httpOptions){
            var optionsList = utils().buildOptionsList(uri + 'register', null, httpOptions);
            optionsList.json = device;
            return utils().wrap(rest, 'post', optionsList, null);
        },

        deregister: function(device, httpOptions){
            var optionsList = utils().buildOptionsList(uri + 'deregister', null, httpOptions);
            optionsList.json = device;
            return utils().wrap(rest, 'post', optionsList, null);
        }


    }, {});

};