'use strict';

var $keypath = require('./keypath')
var $util = require('./util')
function DMO (opts) {
	var dmo = this
	var $data = opts.props || {}
	Object.defineProperty(dmo, '$data', {
		enumerable: true,
        get: function () {
        	return $data
        },
        set: function () {
        	console.error('Cant\' not set value to $data.')
        }
	})

	this._keyObservers = {}
	this._wildcardObservers = []
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
			that.$emit(k, kvpairs[k])
		})
	} else if (args.length >= 2) {
		$keypath.set(this.$data, keypath, value)
		this.$emit(keypath, value)
	}
}
proto.$update = function (keypath) {
	this.$emit(keypath, this.$get(keypath))
}
proto.$get = function (keypath) {
	return $keypath.get(this.$data, keypath)
}
proto.$emit = function (keypath, payload) {
	var kobs = this._keyObservers[keypath]
	var that = this
	kobs && kobs.forEach(function (fn) {
		fn && fn.call(that, payload)
	})
	this._wildcardObservers.forEach(function (fn) {
		fn && fn.call(that, keypath, payload)
	})
}
proto.$watch = function (keypath, fn) {
	if (!arguments.length) {
		this._wildcardObservers.push(fn)
	} else {
		var kobs = this._keyObservers[keypath]
		if (!kobs) {
			kobs = this._keyObservers[keypath] = []
		}
		kobs.push(fn)
	}
	var that = this
	return function () {
		that.$unwatch.apply(that, arguments)
	}
}
proto.$unwatch = function (keypath, fn) {
	var kobs
	var nobs

	if ($util.type(keypath) == 'function') {
		kobs = this._wildcardObservers
		nobs = []
		kobs.forEach(function (o) {
			if (o !== fn) nobs.push(o)
		})
		this._wildcardObservers = nobs

	} else {
		kobs = this._keyObservers[keypath]
		nobs = []
		kobs && kobs.forEach(function (o) {
			if (o !== fn) nobs.push(o)
		})
		this._keyObservers[keypath] = nobs
	}
}
// TBD
proto.$remove()
proto.$insert()
proto.$concat()
proto.$push()
proto.$pop()
proto.$shift()
proto.$unshift()
proto.$splice()
proto.$sort()

module.exports = DMO
