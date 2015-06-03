/**
* dmo.js v0.0.1
* (c) 2015 guankaishe
* Released under the MIT License.
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["DMO"] = factory();
	else
		root["DMO"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1)

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $keypath = __webpack_require__(2)
	var $util = __webpack_require__(3)
	function DMO (opts) {
		var dmo = this
		var $data = {}
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

	module.exports = DMO


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 *  normalize all access ways into dot access
	 *  @example "person.books[1].title" --> "person.books.1.title"
	 */
	function _keyPathNormalize(kp) {
	    return new String(kp).replace(/\[([^\[\]]+)\]/g, function(m, k) {
	        return '.' + k.replace(/^["']|["']$/g, '')
	    })
	}
	/**
	 *  set value to object by keypath
	 */
	function _set(obj, keypath, value, hook) {
	    var parts = _keyPathNormalize(keypath).split('.')
	    var last = parts.pop()
	    var dest = obj
	    parts.forEach(function(key) {
	        // Still set to non-object, just throw that error
	        dest = dest[key]
	    })
	    if (hook) {
	        // hook proxy set value
	        hook(dest, last, value)
	    } else {
	        dest[last] = value
	    }
	    return obj
	}
	/**
	 *  Get undefine
	 */
	function undf () {
	    return void(0)
	}
	function isNon (o) {
	    return o === undf() || o === null
	}
	/**
	 *  get value of object by keypath
	 */
	function _get(obj, keypath) {
	    var parts = _keyPathNormalize(keypath).split('.')
	    var dest = obj
	    parts.forEach(function(key) {
	        if (isNon(dest)) return !(dest = undf())
	        dest = dest[key]
	    })
	    return dest
	}

	/**
	 *  append path to a base path
	 */
	function _join(pre, tail) {
	    var _hasBegin = !!pre
	    if(!_hasBegin) pre = ''
	    if (/^\[.*\]$/.exec(tail)) return pre + tail
	    else if (typeof(tail) == 'number') return pre + '[' + tail + ']'
	    else if (_hasBegin) return pre + '.' + tail
	    else return tail
	}
	/**
	 *  remove the last section of the keypath
	 *  digest("a.b.c") --> "a.b"
	 */
	function _digest(nkp) {
	    var reg = /(\.[^\.]+|\[([^\[\]])+\])$/
	    if (!reg.exec(nkp)) return ''
	    return nkp.replace(reg, '')
	}
	module.exports = {
	    normalize: _keyPathNormalize,
	    set: _set,
	    get: _get,
	    join: _join,
	    digest: _digest
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	function hasOwn (obj, prop) {
	    return obj && obj.hasOwnProperty(prop)
	}
	module.exports = {
	    type: function (obj) {
	        return /\[object (\w+)\]/.exec(Object.prototype.toString.call(obj))[1].toLowerCase()
	    },
	    objEach: function (obj, fn) {
	        if (!obj) return
	        for(var key in obj) {
	            if (hasOwn(obj, key)) {
	                if(fn(key, obj[key]) === false) break
	            }
	        }
	    },
	    extend: function () {
	        if (this.type(obj) != 'object') return obj
	        var source, prop
	        for (var i = 1, length = arguments.length; i < length; i++) {
	            source = arguments[i]
	            for (prop in source) {
	                if (hasOwn(source, prop)) {
	                    obj[prop] = source[prop]
	                }
	            }
	        }
	        return obj;
	    },
	    hasOwn: hasOwn
	}

/***/ }
/******/ ])
});
;