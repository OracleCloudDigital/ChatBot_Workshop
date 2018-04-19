var utils = require("./utils");
var token = require("./token");

var systemUriPrefix = 'mobile/system/locationManagement/';
var uriPrefix = '/mobile/platform/location/';
var devicePrefix = uriPrefix + 'devices';
var placePrefix = uriPrefix + 'places';
var assetPrefix = uriPrefix + 'assets';

module.exports = function(rest) {

    return Object.create({

        devices: Object.create({
            query: function(args, httpOptions){
                var optionsList = utils().buildOptionsList(devicePrefix + '/query', args, httpOptions);
                optionsList.json = true;
                optionsList.body = args;
                return utils().wrapMCSResult(rest.postAsync(optionsList));
            },

            getDevice: function(id, httpOptions){
                var optionsList = utils().buildOptionsList(buildURIForGet(id, 'devices'), null, httpOptions);
                return utils().wrapMCSResult(rest.getAsync(optionsList));
            },

            register: function(device, context, httpOptions){
                var optionsList = utils().buildOptionsList(devicePrefix, null, httpOptions);
                return token(rest).getToken(context.mbe, context.version, context.username).then(register.bind(this, 'devices', device,  null, optionsList));
            },

            update: function(id, device, context, httpOptions){
                var optionsList = utils().buildOptionsList(devicePrefix, null, httpOptions);
                return token(rest).getToken(context.mbe, context.version, context.username).then(update.bind(this, 'devices', id, device,  null, optionsList));
            },
            remove: function(id, context, httpOptions){
                var optionsList = utils().buildOptionsList(devicePrefix, null, httpOptions);
                return token(rest).getToken(context.mbe, context.version, context.username).then(remove.bind(this, 'devices', id,  null, optionsList));
            }

        }, {}),

        places:  Object.create({
            query: function(args, httpOptions){
                var optionsList = utils().buildOptionsList(placePrefix + '/query', args, httpOptions);
                optionsList.json = true;
                optionsList.body = args;
                return utils().wrapMCSResult(rest.postAsync(optionsList));
            },

            getPlace: function(id, httpOptions){
                var optionsList = utils().buildOptionsList(buildURIForGet(id, 'places'), null, httpOptions);
                return utils().wrapMCSResult(rest.getAsync(optionsList));
            },

            register: function(place, context, httpOptions){
                var optionsList = utils().buildOptionsList(placePrefix, null, httpOptions);
                return token(rest).getToken(context.mbe, context.version, context.username).then(register.bind(this, 'places', place,  null, optionsList));
            },

            update: function(id, place, context, httpOptions){
                var optionsList = utils().buildOptionsList(placePrefix, null, httpOptions);
                return token(rest).getToken(context.mbe, context.version, context.username).then(update.bind(this, 'places', id, place,  null, optionsList));
            },
            remove: function(id, context, httpOptions){
                var optionsList = utils().buildOptionsList(placePrefix, null, httpOptions);
                return token(rest).getToken(context.mbe, context.version, context.username).then(remove.bind(this, 'places', id,  null, optionsList));
            }
        }, {}),

        assets:  Object.create({
            query: function(args, httpOptions){
                var optionsList = utils().buildOptionsList(assetPrefix + '/query', args, httpOptions);
                optionsList.json = true;
                optionsList.body = args;
                return utils().wrapMCSResult(rest.postAsync(optionsList));
            },
            getAsset: function(id, httpOptions){
                var optionsList = utils().buildOptionsList(buildURIForGet(id, 'assets'), null, httpOptions);
                return utils().wrapMCSResult(rest.getAsync(optionsList));
            },

            register: function(asset, context, httpOptions){
                var optionsList = utils().buildOptionsList(placePrefix, null, httpOptions);
                return token(rest).getToken(context.mbe, context.version, context.username).then(register.bind(this, 'assets', asset,  null, optionsList));
            },

            update: function(id, asset, context, httpOptions){
                var optionsList = utils().buildOptionsList(placePrefix, null, httpOptions);
                return token(rest).getToken(context.mbe, context.version, context.username).then(update.bind(this, 'assets', id, asset,  null, optionsList));
            },
            remove: function(id, context, httpOptions){
                var optionsList = utils().buildOptionsList(placePrefix, null, httpOptions);
                return token(rest).getToken(context.mbe, context.version, context.username).then(remove.bind(this, 'assets', id,  null, optionsList));
            }

        }, {})

    }, {});

    function buildURIForGet(id, type){
        var uri = uriPrefix + type;
        if (typeof id == 'object' && id.name){
            return uri + '?name=' + id.name;
        } else {
            var identifier = id;
            if (id.id){
                identifier = id.id;
            }
            return uri + '/' + identifier;
        }
    }

    function register(type, item, opts, httpOptions, authorization){
        var optionsList = utils().createOptionsListWithAuthToken(systemUriPrefix + type, authorization.result, opts, httpOptions);
        optionsList.json = item;
        return utils().wrapMCSResult(rest.postAsync(optionsList));
    }

    function update(type, id, item, opts, httpOptions, authorization){
        var optionsList = utils().createOptionsListWithAuthToken(systemUriPrefix + type + '/' + id, authorization.result, opts, httpOptions);
        optionsList.json = item;
        return utils().wrapMCSResult(rest.putAsync(optionsList));
    }

    function remove(type, id, opts, httpOptions, authorization){
        var optionsList = utils().createOptionsListWithAuthToken(systemUriPrefix + type + '/' + id, authorization.result, opts, httpOptions);
        return utils().wrapMCSResult(rest.deleteAsync(optionsList));
    }

};

