/**
 * Created by schwarzkopfb on 15/8/19.
 */

// should be const, when it'll be part of the standard
var DEFAULT_OPTIONS = {
    ignoreCase: false,
    single:     false
}

function Enum(descriptor) {
    var args = Array.prototype.slice.call(arguments)

    if(!(this instanceof Enum))
        return new (Enum.bind.apply(Enum, [ descriptor ].concat(args)))()

    var opts

    // check if an options object passed as the last argument
    if(args.length > 1 && args[args.length - 1] instanceof Object)
        opts = extend(args[args.length - 1], DEFAULT_OPTIONS)
    else
        opts = DEFAULT_OPTIONS

    if(!Array.isArray(descriptor) && !(descriptor instanceof Object))
        descriptor = args

    var _ = {
        numberToValue: {},
        valueToNumber: {},
        numberToKey: {},
        keyToNumber: {},
        keyToValue: {},
        valueToKey: {},
        keys:   [],
        values: [],
        length: 0,
        opts: opts
    }

    Object.defineProperty(this, '_', { value: _ })

    if(Array.isArray(descriptor)) {
        _.length = descriptor.length

        for(var n = 1, i = 0, l = descriptor.length; i < l; n *= 2, i++) {
            var value = descriptor[ i ],
                key   = value + ''

            if(opts.ignoreCase)
                key = key.toLowerCase()

            this[ key ] = n

            _.numberToValue[n]     = value
            _.valueToNumber[value] = n
            _.numberToKey[n]       = key
            _.keyToNumber[key]     = n
            _.keyToValue[key]      = value
            _.valueToKey[value]    = key

            _.keys.push(key)
            _.values.push(value)
        }
    }
    else if(descriptor instanceof Object) {
        n = 1
        i = 0

        for(key in descriptor) {
            if(!descriptor.hasOwnProperty(key)) continue
            i++
            n *= 2

            value = descriptor[ key ]

            if(opts.ignoreCase)
                key = key.toLowerCase()

            this[ key ] = n

            _.numberToValue[n]     = value
            _.valueToNumber[value] = n
            _.numberToKey[n]       = key
            _.keyToNumber[key]     = n
            _.valueToKey[value]    = key

            _.keys.push(key)
            _.values.push(value)
        }

        _.keyToValue = descriptor
        _.length = i
    }

    if(_.length > MAX_LENGTH)
        throw Error('An enum can contain a maximum of ' + MAX_LENGTH + ' items in this environment.')
}

Object.defineProperties(Enum.prototype, {
    _checkValue: {
        value: function (n) {
            if(this._.opts.single && !isPowerOf2(n))
                throw Error('This enum allows only one single choice.')
        }
    },

    valueOf: {
        value: function(n) {
            this._checkValue(n)

            return item(this._.numberToValue, this.length, n)
        }
    },

    keyOf: {
        value: function(n) {
            this._checkValue(n)

            return item(this._.numberToKey, this.length, n)
        }
    },

    valuesOf: {
        value: function (n) {
            this._checkValue(n)

            return items(this._.numberToValue, this.length, n)
        }
    },

    keysOf: {
        value: function (n) {
            this._checkValue(n)

            return items(this._.numberToKey, this.length, n)
        }
    },

    valueByKey: {
        value: function(key) {
            if(this._.opts.ignoreCase)
                key = key.toLowerCase()

            return this._.keyToValue[key]
        }
    },

    valuesByKeys: {
        value: function(keys) {
            if(!Array.isArray(keys))
                keys = Array.prototype.slice.call(arguments)

            if(this._.opts.ignoreCase)
                keys = keys.map(function (key) { return key.toLowerCase() })

            return collect(this._.keyToValue, keys)
        }
    },

    keyByValue: {
        value: function(value) {
            return this._.valueToKey[value]
        }
    },

    keysByValues: {
        value: function(values) {
            if(!Array.isArray(values))
                values = Array.prototype.slice.call(arguments)

            return collect(this._.valueToKey, values)
        }
    },

    item: {
        value: function (key) {
            if(this._.opts.ignoreCase)
                key = key.toLowerCase()

            var item = this._.keyToNumber[key]

            return {
                key:   key,
                value: this._.keyToValue[key],

                'in': function (items) {
                    return (item !== undefined) && !!(items & item)
                }
            }
        }
    },

    'get': {
        value: function (key) {
            switch(typeof key) {
                case 'number':
                    var value = this._.values[key]

                    if(value !== undefined)
                        return {
                            key:   this._.keys[key],
                            value: value
                        }
                    else
                        return value

                    break

                case 'string':
                    if(this._.opts.ignoreCase)
                        key = key.toLowerCase()

                    value = this._.keyToValue[key]

                    if(value !== undefined)
                        return {
                            key: key,
                            value: value
                        }
                    else
                        return value

                    break

                default:
                    return null
            }
        }
    },

    keys: {
        get: function() {
            return this._.keys
        }
    },

    values: {
        get: function() {
            return this._.values
        }
    },

    items: {
        get: function() {
            var values = this._.values

            return this._.keys.map(function (key, i) {
                return {
                    key: key,
                    value: values[i]
                }
            })
        }
    },

    length: {
        get: function () {
            return this._.length
        },

        set: function (value) {
            return value
        }
    },

    toJSON: {
        value: function (value) {
            if(typeof value === 'number')
                return this.valuesOf(value)
            else
                return this._.keyToValue
        }
    },

    fromJSON: {
        value: function (value) {
            if(typeof value === 'string')
                value = JSON.parse(value)

            if(!Array.isArray(value))
                value = [ value ]

            var n = 0,
                lookup = this._.valueToNumber

            for(var i = 0, l = value.length; i < l; i++) {
                var number = lookup[value[i]]

                if(number)
                    n |= number
            }

            return n
        }
    },

    inspect: {
        value: function() {
            return 'Enum(' + JSON.stringify(this._.keyToValue, null, 4) + ')'
        }
    },

    toString: {
        value: function () {
            return '[object Enum]'
        }
    }
})

Object.defineProperties(Enum, {
    fromJSON: {
        enumerable: true,

        value: function (value) {
            if(typeof value === 'string')
                value = JSON.parse(value)

            return new Enum(value)
        }
    },

    MAX_LENGTH: {
        enumerable: true,

        get: function () {
            return MAX_LENGTH
        }
    },

    global: {
        enumerable: true,
        
        get: function () {
            return 'Enum' in global
        },

        set: function (value) {
            if(value)
                global.Enum = Enum
            else
                delete global['Enum']
        }
    },

    item: {
        enumerable: true,

        value: function (item) {
            return {
                'in': function (items) {
                    return (typeof item === 'number') && !!(items & item)
                },

                isSingle: function () {
                    return isPowerOf2(item)
                },

                isMultiple: function () {
                    return !isPowerOf2(item)
                }
            }
        }
    }
})

// utility functions

function isPowerOf2(n) {
    if(!n)
        return false
    else
        return (n & (n - 1)) === 0
}

function extend(original, add) {
    for(var key in add)
        if(add.hasOwnProperty(key) && !(key in original))
            original[ key ] = add[ key ]

    return original
}

function collect(lookup, ids) {
    var result = []

    for(var i = 0, l = ids.length; i < l; i++)
        result.push(lookup[ids[i]])

    return result
}

function item(lookup, length, value) {
    for(var n = 1, i = 0; i <= length; n *= 2, i++)
        if (value & n)
            return lookup[ n ]

    return null
}

function items(lookup, length, value) {
    var result = []

    for(var n = 1, i = 0; i <= length; n *= 2, i++)
        if (value & n)
            result.push(lookup[ n ])

    return result
}

// find the maximum length of an Enum for the current environment (typically 32 or 64, but there are special cases)

var MAX_LENGTH = 0

var tmp = 1, n = 1

while(tmp > 0) {
    tmp |= n
    n   *= 2
    MAX_LENGTH++
}

// expose constructor

module.exports = Enum