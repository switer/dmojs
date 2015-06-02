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