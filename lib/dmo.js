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

function _set(k, v) {
	$keypath.set(this.$data, keypath, value)
	this.$emit(keypath, value)
}
function _setMultiple(kvpairs) {
	var keys = Object.keys(kvpairs)
	var that = this
	keys.forEach(function (k) {
		that.$data[k] = kvpairs[k]
	})
	keys.forEach(function (k) {
		that.$emit(k, kvpairs[k])
	})
}
function _spliceFunc () {
	var args = arguments
	var alen = args.length
	// do nothing
	if (alen == 2 && (!args[1] || args[1] < 0) return 'none'
	// remove and insert, if args[1] is 0, remove nothing but insert
	else if (alen > 2) return 'insert'
	// remove length(args[1]) from the index(args[0])
	else if (alen == 2) return 'remove'
	// remove all from the index(args[0])
	else if (alen == 1) return 'remove'
	else return 'none'
}

var proto = DMO.prototype

proto.$set = function (keypath/*, value, extra | kvpairs*/) {
	var args = arguments
	var kvpairs = keypath = args[0]

	if ($util.type(kvpairs) == 'object') {
		_setMultiple.call(kvpairs)
	} else if (args.length >= 2) {
		_set.call(this, keypath, args[1], args[2])
	}
	return this
}
proto.$update = function (keypath) {
	this.$emit(keypath, this.$get(keypath))
}
proto.$get = function (keypath) {
	return $keypath.get(this.$data, keypath)
}
proto.$emit = function (keypath, payload, extra) {
	var kobs = this._keyObservers[keypath]
	var that = this
	kobs && kobs.forEach(function (fn) {
		fn && fn.call(that, payload, extra)
	})
	this._wildcardObservers.forEach(function (fn) {
		fn && fn.call(that, keypath, payload, extra)
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
	var kobs, nobs

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
proto.$concat = function (keypath, another) {
	var l = this.$get(keypath)
	l && this.$set(keypath, l.concat(another))
	return this
}
proto.$push = function () {

}
proto.$pop = function () {

}
proto.$shift = function () {

}
proto.$unshift = function () {

}
proto.$splice = function (keypath) {
	var l = this.$get(keypath)
	var args = [].slice.call(arguments)
	args.shift()
	if (l) {
		l.splice.apply(l, args)
		this.$set(keypath, l, 'splice')
	}
	return this
}
proto.$sort = function () {

}

module.exports = DMO
