'use strict';

var $keypath = require('./keypath')
var $util = require('./util')
function DMO (opts) {
	var dmo = this
	var $data = {}
	Object.defineProperty(dmo, '$data', {
		enumerable: true,
        get: function () {
        	return $data
        },
        set: function () {
        	console.log('Cant\' not set value to $data.')
        }
	})
}
var proto = DMO.prototype

proto.$set = function (/*keypath, value | kvpairs*/) {
	var args = arguments
	var kvpairs = keypath = args[0]
	var value = args[1]
	var that = this

	if ($util.type(kvpairs) == 'object') {
		var keys = Object.keys(kvpairs)
		keys.forEach(function (k) {
			that.$data[k] = kvpairs[k]
		})
		keys.forEach(function (k) {
			that.$emit(k)
		})
	} else if (args.length >= 2) {
		$keypath.set(this.$data, keypath)
		this.$emit(keypath)
	}
}
proto.$get = function (keypath) {
	return $keypath.get(this.$data, keypath)
}

module.exports = DMO