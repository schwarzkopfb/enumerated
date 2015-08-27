/**
 * Created by schwarzkopfb on 15/8/19.
 */

/**
 * @module enumerated
 * @description A simple, lightweight, easy-to-use and high performance implementation of enumerated type for JavaScript.
 *
 * @author Schwarzkopf Balázs <schwarzkopfb@icloud.com>
 */
!function () {

    var _global = 'window' in this ? window : global

    /**
     * Default options for Enum instance.
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
     * @class
     * @global
     *
     * @param {...String|String[]|Object} descriptor - An array, object or set of string arguments specifying the elements of this instance.
     * @param {Object} [options] - An object containing options about the desired behaviour of this instance.
     * @param {Boolean} options.ignoreCase - If set to true, this instance will ignore case of the keys of its elements.
     * @param {Boolean} options.single - If set to true, this instance will not be flaggable.
     *
     * @example
     * var colors  = new Enum('red', 'green', 'blue'),
     *     numbers = Enum({ one: 1, two: 2, three: 3 }) // new operator is optional
     *
     * var selectedColors = colors.red | colors.blue
     *
     * colors.keysOf(selectedColors) // [ 'red', 'blue' ]
     * colors.valuesOf(selectedColors) // [ 'red', 'blue' ]
     *
     * selectedColors |= colors.green // extend selectedColors with colors.green
     *
     * colors.keysOf(selectedColors) // [ 'red', 'green', 'blue' ]
     *
     * selectedColors ^= colors.red // remove colors.red from selectedColors
     *
     * colors.keysOf(selectedColors) // [ 'green', 'blue' ]
     *
     * selectedColors ^= colors.green | colors.blue // remove colors.green and colors.blue from selectedColors in one step
     *
     * colors.keysOf(selectedColors) // []
     *
     * // not flaggable enum
     *
     * var state        = Enum('initial', 'pending', 'processing', 'finished', { single: true }),
     *     currentState = state.processing
     *
     * state.valueOf(currentState) // 'processing'
     *
     * currentState |= state.finished // extend currentState with state.finished
     *
     * state.valueOf(currentState) // throws Error('This enum allows only one single choice.')
     *
     * // case insensitive enum
     *
     * var days = Enum('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', { ignoreCase: true })
     *
     * days.get('monday') // { key: 'monday', value: 'Monday' }
     * days.get('fRiDaY') // { key: 'friday', value: 'Friday' }
     *
     * // items will be accessible lowercased with the dot or index operator if ignoreCase option is set to true
     * var selectedDays = days.saturday | days['sunday']
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
             * var colors   = Enum({ red: 1, green: 2 }),
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
             * @returns {String}
             *
             * @example
             * var colors   = Enum({ red: 1, green: 2 }),
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
             * @returns {Array}
             *
             * @example
             * var colors   = Enum({ red: 1, green: 2 }),
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
             * @returns {Array}
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
             * @returns {Array}
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
             * @param {*} value
             * @returns {String}
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
            /**
             * Returns associated keys of elements of this Enum instance by related values.
             *
             * @memberof Enum
             * @instance
             * @method keysByValues
             *
             * @param {...*|Array} values
             * @returns {String[]}
             *
             * @example
             * var colors = Enum({ red: 1, green: 2 })
             *
             * colors.keysByValues([ 1, 2 ]) // [ 'red', 'green' ]
             * colors.keysByValues(1, 2) // [ 'red', 'green' ]
             */
            value: function(values) {
                if(!Array.isArray(values))
                    values = Array.prototype.slice.call(arguments)

                return collect(this._.valueToKey, values)
            }
        },

        fromValue: {
            /**
             * Returns an integer representing one element of this Enum instance by related value.
             *
             * @memberof Enum
             * @instance
             * @method fromValue
             *
             * @param {*} value - The value of the chosen element.
             * @returns {Number}
             *
             * @example
             * var colors  = Enum({ red: 1, green: 2 }),
             *     colors2 = Enum('red', 'green')
             *
             * colors.fromValue(1) // 1, because 2^0=1, so 1 represents the first element of the enum
             * colors2.fromValue('green') // 2, because 2^1=2, so 2 represents the second number of the enum
             *
             * colors.keysOf(colors.fromValue(1) | colors.fromValue(2)) // [ 'red', 'green' ]
             */
            value: function (value) {
                return this._.valueToNumber[value]
            }
        },

        fromValues: {
            /**
             * Returns an integer representing one or more elements of this Enum instance by related values.
             *
             * @memberof Enum
             * @instance
             * @method fromValues
             *
             * @param {...*|Array} value - The values of the chosen elements.
             * @returns {Number}
             *
             * @example
             * var colors = Enum({ red: 1, green: 2 })
             *
             * colors.fromValues([ 1, 2 ]) // 3, because 2^0 | 2^1 = 3, so 3 represents the first and second elements of the enum
             * colors.fromValues(1, 2) // 3, same as previous
             *
             * colors.keysOf(colors.fromValues(1, 2)) // [ 'red', 'green' ]
             */
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

        fromKey: {
            /**
             * Returns an integer representing one element of this Enum instance by related key.
             *
             * @memberof Enum
             * @instance
             * @method fromKey
             *
             * @param {String} key - The key of the chosen element.
             * @returns {Number}
             *
             * @example
             * var colors  = Enum({ red: 1, green: 2 }),
             *     colors2 = Enum('red', 'green')
             *
             * colors.fromKey('red') // 1, because 2^0=1, so 1 represents the first element of the enum
             * colors2.fromKey('green') // 2, because 2^1=2, so 2 represents the second number of the enum
             *
             * colors.valuesOf(colors.fromKey('red') | colors.fromKey('green')) // [ 1, 2 ]
             */
            value: function (key) {
                if(this._.opts.ignoreCase)
                    key = key.toLowerCase()

                return this._.keyToNumber[key]
            }
        },

        fromKeys: {
            /**
             * Returns an integer representing one or more elements of this Enum instance by related keys.
             *
             * @memberof Enum
             * @instance
             * @method fromKeys
             *
             * @param {...String|String[]} value - The keys of the chosen elements.
             * @returns {Number}
             *
             * @example
             * var colors = Enum({ red: 1, green: 2 })
             *
             * colors.fromKeys([ 'red', 'green' ]) // 3, because 2^0 | 2^1 = 3, so 3 represents the first and second elements of the enum
             * colors.fromKeys('red', 'green') // 3, same as previous
             *
             * colors.valuesOf(colors.fromKeys('red', 'green')) // [ 1, 2 ]
             */
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

        item: {
            /**
             * Returns an object representing one element of this Enum instance by related key or index.
             * The returned object has three members:
             * - 'key': the key of the element
             * - 'value': the value of the element
             * - 'in': method to test item against an integer value representing elements of this enum
             *
             * @memberof Enum
             * @instance
             * @method item
             *
             * @param {String|Number} key - The key or index of the chosen element.
             * @returns {{in:function,key:string,value:*}}
             *
             * @example
             * var colors = Enum({ red: 1, green: 2 })
             *
             * colors.item('red').value // 1
             * colors.item(1).key // 'green', because elements are indexed from zero
             *
             * colors.item('red').in(colors.green | colors.red) // true
             * colors.item('green').in(colors.red) // false
             */
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
            /**
             * Returns an object representing one element of this Enum instance by related key or index.
             * The returned object has three members:
             * - 'key': the key of the element
             * - 'value': the value of the element
             *
             * @memberof Enum
             * @instance
             * @method get
             *
             * @param {String|Number} key - The key or index of the chosen element.
             * @returns {{key:string,value:*}}
             *
             * @example
             * var colors = Enum({ red: 1, green: 2 })
             *
             * colors.get('red').value // 1
             * colors.get(1).key // 'green', because elements are indexed from zero
             */
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

        fromJSON: {
            /**
             * Returns an integer representing one or more elements of this Enum instance from a JSON serialized enum value.
             *
             * @memberof Enum
             * @instance
             * @method fromJSON
             *
             * @param {String|Object} value - JSON serialized enum value.
             * @returns {Number}
             *
             * @example
             * var colors = Enum({ red: 1, green: 2 })
             *
             * colors.fromJSON('[1,2]') // 3, because 2^0 | 2^1 = 3, so 3 represents the first and second elements of the enum
             * colors.fromJSON([ 2 ]) // 2, because 2^1 = 2, so 2 represents the second element of the enum
             */
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

    /**
     * Check the given number is power of two or not.
     *
     * @param {Number} n - The number to check.
     * @returns {boolean}
     */
    function isPowerOf2(n) {
        return !!n && (n & (n - 1)) === 0
    }

    /**
     * Extend an object with another one only with those keys that are missing from the original object.
     *
     * @param {Object} original - Object to be extended.
     * @param {Object} add - Object to extend with.
     * @returns {Object}
     */
    function extend(original, add) {
        for(var key in add)
            if(add.hasOwnProperty(key) && !(key in original))
                original[ key ] = add[ key ]

        return original
    }

    /**
     * Gather values from an object by the given array of keys.
     *
     * @param {Object} lookup - The object containing values to be collected.
     * @param {String[]} ids - The array of keys we need to collect.
     * @returns {Array}
     */
    function collect(lookup, ids) {
        var result = []

        for(var i = 0, l = ids.length; i < l; i++)
            result.push(lookup[ids[i]])

        return result
    }

    /**
     * Get a value from the given object by comparing the bits of keys in the object and the given integer.
     *
     * @param {Object} lookup - The object containing values to search.
     * @param {Number} length - The maximum count of iterations.
     * @param {Number} value - A number to be compared.
     * @returns {*}
     */
    function item(lookup, length, value) {
        for(var n = 1, i = 0; i <= length; n *= 2, i++)
            if (value & n)
                return lookup[ n ]

        return null
    }

    /**
     * Get an array of values from the given object by comparing the bits of keys in the object and the given integer.
     *
     * @param {Object} lookup - The object containing values to search.
     * @param {Number} length - The maximum count of iterations.
     * @param {Number} value - A number to be compared.
     * @returns {*}
     */
    function items(lookup, length, value) {
        var result = []

        for(var n = 1, i = 0; i <= length; n *= 2, i++)
            if (value & n)
                result.push(lookup[ n ])

        return result
    }

    /**
     * Maximum element count of an Enum instance in the current environment.
     *
     * @type {Number}
     */
    var MAX_LENGTH = 0,
        tmp        = 1,
        n          = 1

    // find the maximum length of an Enum for the current environment (typically 32 or 64, but there are special cases)

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
    catch(ex) {}

}()