/**
 * Created by schwarzkopfb on 15/8/19.
 */

!function () {

    var _global = 'window' in this ? window : global

    /**
     * Default options for Enum.
     *
     * @type {{ignoreCase: boolean, single: boolean}}
     */
    // note: should be const, when it'll be part of the standard
    var DEFAULT_OPTIONS = {
        ignoreCase: false,
        single:     false
    }

    /**
     * Class representing a custom enumerated type containing the specified items given to the constructor.
     *
     * @constructor
     * @class Enum
     * @global
     *
     * @param {...String|String[]|Object} descriptor - An array, object or set of string arguments specifying the elements of this instance.
     * @param {Object} [options] - An object containing options about the desired behaviour of this instance.
     */
    function Enum(descriptor, options) {
        var args = Array.prototype.slice.call(arguments)

        if(!(this instanceof Enum))
            return new (Enum.bind.apply(Enum, [ descriptor ].concat(args)))()

        var opts

        // check if an options object passed as the last argument
        if(args.length > 1 && args[args.length - 1] instanceof Object)
            opts = extend(args.pop(), DEFAULT_OPTIONS)
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
                _.keyToValue[key]      = value
                _.valueToKey[value]    = key

                _.keys.push(key)
                _.values.push(value)
            }

            _.keyToNumber = this
        }
        else if(descriptor instanceof Object) {
            n = 1
            i = 0

            for(key in descriptor) {
                if(!descriptor.hasOwnProperty(key)) continue

                value = descriptor[ key ]

                if(opts.ignoreCase)
                    key = key.toLowerCase()

                this[ key ] = n

                _.numberToValue[n]     = value
                _.valueToNumber[value] = n
                _.numberToKey[n]       = key
                _.valueToKey[value]    = key

                _.keys.push(key)
                _.values.push(value)

                i++
                n *= 2
            }

            _.keyToValue  = descriptor
            _.keyToNumber = this
            _.length      = i
        }

        if(_.length <= 0)
            throw Error('At least one item is required to instantiate an Enum.')
        else if(_.length > MAX_LENGTH)
            throw Error('An enum can contain a maximum of ' + MAX_LENGTH + ' items in this environment.')
    }

    Object.defineProperties(Enum.prototype, {
        _checkValue: {
            /**
             * Internal function to validate options.single for the current instance.
             *
             * @param {Number} n - Value to be checked.
             */
            value: function (n) {
                if(this._.opts.single && !isPowerOf2(n))
                    throw Error('This enum allows only one single choice.')
            }
        },

        valueOf: {
            /**
             * Returns associated value from an integer representing an Enum element.
             * If value contains more than one element, it'll return the first one.
             *
             * @memberof Enum
             * @instance
             * @method valueOf
             *
             * @param {Number} n - An integer value that specifies one or more elements of this Enum type.
             * @returns {*}
             *
             * @example
             * var colors   = Enum({ red: 1, green: 2 })
             *     selected = colors.red | colors.green
             *
             * colors.valueOf(selected) // 1
             */
            value: function(n) {
                this._checkValue(n)

                return item(this._.numberToValue, this.length, n)
            }
        },

        keyOf: {
            /**
             * Returns associated key from an integer representing an Enum element.
             * If value contains more than one element, it'll return the first one.
             *
             * @memberof Enum
             * @instance
             * @method keyOf
             *
             * @param {Number} n - An integer value that specifies one or more elements of this Enum type.
             * @returns {*}
             *
             * @example
             * var colors   = Enum({ red: 1, green: 2 })
             *     selected = colors.red | colors.green
             *
             * colors.valueOf(selected) // 'red'
             */
            value: function(n) {
                this._checkValue(n)

                return item(this._.numberToKey, this.length, n)
            }
        },

        valuesOf: {
            /**
             * Returns an array of associated values from an integer representing one or more Enum elements.
             *
             * @memberof Enum
             * @instance
             * @method valuesOf
             *
             * @param {Number} n - An integer value that specifies one or more elements of this Enum type.
             * @returns {*}
             *
             * @example
             * var colors   = Enum({ red: 1, green: 2 })
             *     selected = colors.red | colors.green
             *
             * colors.valueOf(selected) // [ 1, 2 ]
             */
            value: function (n) {
                this._checkValue(n)

                return items(this._.numberToValue, this.length, n)
            }
        },

        keysOf: {
            /**
             * Returns an array of associated keys from an integer representing one or more Enum elements.
             *
             * @memberof Enum
             * @instance
             * @method keysOf
             *
             * @param {Number} n - An integer value that specifies one or more elements of this Enum type.
             * @returns {*}
             *
             * @example
             * var colors   = Enum({ red: 1, green: 2 })
             *     selected = colors.red | colors.green
             *
             * colors.valueOf(selected) // [ 'red', 'green' ]
             */
            value: function (n) {
                this._checkValue(n)

                return items(this._.numberToKey, this.length, n)
            }
        },

        valueByKey: {
            /**
             * Returns associated value of an element of this Enum instance by its key.
             *
             * @memberof Enum
             * @instance
             * @method valueByKey
             *
             * @param {String} key
             * @returns {*}
             *
             * @example
             * var colors = Enum({ red: 1, green: 2 })
             *
             * colors.valueByKey('green') // 2
             */
            value: function(key) {
                if(this._.opts.ignoreCase)
                    key = key.toLowerCase()

                return this._.keyToValue[key]
            }
        },

        valuesByKeys: {
            /**
             * Returns associated values of elements of this Enum instance by related keys.
             *
             * @memberof Enum
             * @instance
             * @method valuesByKeys
             *
             * @param {String[]|...String} keys
             * @returns {*}
             *
             * @example
             * var colors = Enum({ red: 1, green: 2 })
             *
             * colors.valuesByKeys([ 'red', 'green' ]) // [ 1, 2 ]
             * colors.valuesByKeys('green', 'red')     // [ 2, 1 ]
             */
            value: function(keys) {
                if(!Array.isArray(keys))
                    keys = Array.prototype.slice.call(arguments)

                if(this._.opts.ignoreCase)
                    keys = keys.map(function (key) { return key.toLowerCase() })

                return collect(this._.keyToValue, keys)
            }
        },

        keyByValue: {
            /**
             * Returns associated key of an element of this Enum instance by its value.
             *
             * @memberof Enum
             * @instance
             * @method keyByValue
             *
             * @param {String} value
             * @returns {*}
             *
             * @example
             * var colors = Enum({ red: 1, green: 2 })
             *
             * colors.keyByValue(2) // 'green'
             */
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

        fromValue: {
            value: function (value) {
                return this._.valueToNumber[value]
            }
        },

        fromValues: {
            value: function (value) {
                var arr    = value,
                    result = 0,
                    lookup = this._.valueToNumber

                if(!Array.isArray(arr))
                    arr = Array.prototype.slice.call(arguments)

                for(var i = 0, l = arr.length; i < l; i++)
                    result |= lookup[ arr[ i ] ]

                this._checkValue(result)

                return result
            }
        },

        item: {
            value: function (key) {
                var item

                switch(typeof key) {
                    case 'number':
                        item = this._.values[ key ]
                        break

                    case 'string':
                        if (this._.opts.ignoreCase)
                            key = key.toLowerCase()

                        item = this._.keyToNumber[ key ]
                        break

                    default:
                        return null
                }

                return {
                    key: key,
                    value: this._.keyToValue[ key ],

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
                            return null

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
                            return null

                        break

                    default:
                        return null
                }
            }
        },

        fromKey: {
            value: function (value) {
                if(this._.opts.ignoreCase)
                    value = value.toLowerCase()

                return this._.keyToNumber[value]
            }
        },

        fromKeys: {
            value: function (value) {
                var arr    = value,
                    result = 0,
                    lookup = this._.keyToNumber

                if(!Array.isArray(arr))
                    arr = Array.prototype.slice.call(arguments)

                if(this._.opts.ignoreCase)
                    arr = arr.map(String)

                for(var i = 0, l = arr.length; i < l; i++)
                    result |= lookup[ arr[ i ] ]

                this._checkValue(result)

                return result
            }
        },

        fromJSON: {
            value: function (value) {
                if(typeof value === 'string')
                    value = JSON.parse(value)

                if(!Array.isArray(value))
                    value = [ value ]

                var result = 0,
                    lookup = this._.valueToNumber

                for(var i = 0, l = value.length; i < l; i++) {
                    var number = lookup[ value[ i ] ]

                    if(number)
                        result |= number
                }

                this._checkValue(result)

                return result
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

        'switch': {
            value: function (on) {
                var numberToValue = this._.numberToValue,
                    keyToNumber   = this._.keyToNumber

                function block(value, action) {
                    if(typeof value === 'string') {
                        var n = keyToNumber[ value ]

                        if(on & n)
                            action(numberToValue[ n ])
                    }
                    else if (on & value)
                        action(numberToValue[ value ])

                    return block
                }

                return block['case'] = block
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
                return 'Enum' in _global
            },

            set: function (value) {
                if(value)
                    _global.Enum = Enum
                else
                    delete _global['Enum']
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
        },

        'switch': {
            enumerable: true,

            value: function (on) {
                function block(value, action) {
                    if(on & value)
                        action()

                    return block
                }

                return block['case'] = block
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

    var MAX_LENGTH = 0,
        tmp        = 1,
        n          = 1

    while(tmp > 0) {
        tmp |= n
        n   *= 2
        MAX_LENGTH++
    }

    // try to expose constructor

    /**
     * @exports enumerated
     */

    try {
        if('window' in _global)
            _global.enumerated = _global.Enum = Enum // browser
        else
            module.exports = Enum // CommonJS
    }
    catch(ex) {}

    try {
        if('define' in this)
            define(Enum) // AMD (Requirejs)
    }
    catch(ex) { }

}()