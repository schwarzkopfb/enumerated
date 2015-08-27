/**
 * Created by schwarzkopfb on 15/8/19.
 */

var assert = require('assert'),
    utils  = require('./utils'),
    _      = require('../enumerated'),
    ctx    = this

var passed  = 0,
    all     = 0,
    _assert = assert,
    _equal  = assert.equal,
    _throws = assert.throws

assert = function assert() {
    _assert.apply(assert, arguments)
    passed++
    all++
}

assert.equal = function equal() {
    _equal.apply(_equal, arguments)
    passed++
    all++
}

assert.throws = function throws() {
    _throws.apply(_throws, arguments)
    passed++
    all++
}

function doGlobalTest(names) {
    /* - module exposition - */

    assert(_ instanceof Function && _.name === 'Enum', 'module must expose Enum constructor')

    /* - Enum members - */

    // Enum.global

    _.global = true

    assert('Enum' in global, 'Enum constructor must be exposed to the global context')
    assert(Enum.global, 'Enum.global must be true')

    Enum.global = false

    assert(!('Enum' in global), 'Enum constructor must be removed from the global context')

    assert.throws(function () {
        Enum()
    }, 'Enum module cannot be accessible')

    doTest(names)
}

// new scope is required to be able to perform previous tests on Enum.global
function doTest(names) {
    if(names) {
        names = names.props.props

        Object.keys(names).forEach(function (key) {
            names[ key.substring(1) ] = names[ key ]
            delete names[ key ]
        })
    }

    var test, test2, item, Enum = _

    // Enum.MAX_LENGTH

    assert('MAX_LENGTH' in Enum, 'Enum.MAX_LENGTH must be exposed')
    assert(typeof Enum.MAX_LENGTH === 'number', 'Enum.MAX_LENGTH must be a number')
    assert(Enum.MAX_LENGTH > 0, 'Enum.MAX_LENGTH must greater than zero')

    var MAX_LENGTH = Enum.MAX_LENGTH

    Enum.MAX_LENGTH = 42

    assert.equal(Enum.MAX_LENGTH, MAX_LENGTH, 'Enum.MAX_LENGTH is read only')

    // Enum.fromJSON()

    assert('fromJSON' in Enum, 'Enum.fromJSON must be exposed')
    assert(Enum.fromJSON instanceof Function, 'Enum.fromJSON must be a function')
    assert(Enum.fromJSON('[1,2,3]') instanceof Enum, 'Enum.fromJSON must return an Enum instance')

    // Enum.item()

    test = Enum(1, 2, 3)
    item = Enum.item(test[1])

    assert(item instanceof Object, 'Enum.item must return an object')
    assert('in' in item && item['in'] instanceof Function, 'return value of Enum.item must have a method called "in"')
    assert('isSingle' in item && item.isSingle instanceof Function, 'return value of Enum.item must have a method called "isSingle"')
    assert('isMultiple' in item && item.isMultiple instanceof Function, 'return value of Enum.item must have a method called "isMultiple"')

    // Enum.item().in()

    assert(item['in'](test[1]), 'Enum.item(test.1).in(test.1) must return true')
    assert(!item['in'](test[2]), 'Enum.item(test.1).in(test.2) must return false')
    assert(item['in'](test[2] | test[1]), 'Enum.item(test.1).in(test.2 | test.1) must return true')
    assert(!item['in'](test[2] | test[3]), 'Enum.item(test.1).in(test.2 | test.3) must return false')

    // Enum.item().isSingle()

    assert(item.isSingle(), 'Enum.item(test.1).isSingle() must return true')
    assert(!item.isMultiple(), 'Enum.item(test.1).isMultiple() must return false')

    item = Enum.item(test[1] | test[2])

    assert(!item.isSingle(), 'Enum.item(test.1 | test.2).isSingle() must return false')
    assert(item.isMultiple(), 'Enum.item(test.1 | test.2).isSingle() must return false')

    // Enum.switch()

    var st1, st2, st3

    function resetST() {
        st1 = st2 = st3 = false
    }

    Enum['switch'](test[1] | test[3])
        ['case'](test[1], function () {
            st1 = true
        })
        ['case'](test[2], function () {
            st2 = true
        })
        ['case'](test[3], function () {
            st3 = true
        })

    assert(st1 && !st2 && st3, 'Enum.switch().case() chain call must invoke the correct case action functions')

    resetST()

    Enum['switch'](test[2])
        ['case'](test[1], function () {
            st1 = true
        })
        ['case'](test[2], function () {
            st2 = true
        })
        ['case'](test[3], function () {
            st3 = true
        })

    assert(!st1 && st2 && !st3, 'Enum.switch().case() chain call must invoke the correct case action functions')

    resetST()

    /* - Enum constructor - */

    assert.equal(new Enum('a', 'b', 'c').length, 3)
    assert.equal(Enum([ 'a', 'b', 'c' ]).length, 3)
    assert.equal(Enum({ a: 1, b: 2, c: 3 }).length, 3)
    assert.equal(Enum('a', 'b', 'c', { ignoreCase: true }).length, 3)
    assert.equal(Enum([ 'a', 'b', 'c' ], { single: true }).length, 3)
    assert.equal(Enum([ 'a', 'b', 'c' ], { single: true, ignoreCase: true }).length, 3)

    assert.equal(typeof test, 'object', 'Enum() must return an object')
    assert(test instanceof Enum, 'Enum() must return an Enum instance')
    assert.equal(typeof test[1], 'number', 'Enum()[n] must return a number')

    assert.throws(function () {
        new Enum()
    }, 'Enum constructor must validate item count')

    /* - Enum instance members - */

    test  = Enum({ red: 1, green: 2, blue: 3 })
    test2 = Enum([ 'red', 'green', 'blue' ])
    item  = test.red | test.blue

    assert(utils.arrayEqual(Object.keys(test), [ 'red', 'green', 'blue' ]), 'visible Enum instance members have to be limited to the keys of its items')
    assert(utils.arrayEqual(Object.keys(test2), [ 'red', 'green', 'blue' ]), 'visible Enum instance members have to be limited to the keys of its items')

    // lookup tables

    var t_               = test._,
        t2_              = test2._,
        t_keyToValue     = t_['keyToValue'] || t_[names['keyToValue']],
        t2_keyToValue    = t2_['keyToValue'] || t2_[names['keyToValue']],
        t_keyToNumber    = t_['keyToNumber'] || t_[names['keyToNumber']],
        t2_keyToNumber   = t2_['keyToNumber'] || t2_[names['keyToNumber']],
        t_valueToKey     = t_['valueToKey'] || t_[names['valueToKey']],
        t2_valueToKey    = t2_['valueToKey'] || t2_[names['valueToKey']],
        t_valueToNumber  = t_['valueToNumber'] || t_[names['valueToNumber']],
        t2_valueToNumber = t2_['valueToNumber'] || t2_[names['valueToNumber']],
        t_numberToKey    = t_['numberToKey'] || t_[names['numberToKey']],
        t2_numberToKey   = t2_['numberToKey'] || t2_[names['numberToKey']],
        t_numberToValue  = t_['numberToValue'] || t_[names['numberToValue']],
        t2_numberToValue = t2_['numberToValue'] || t2_[names['numberToValue']]

    assert(utils.objectEqual(t_keyToValue, { red: 1, green: 2, blue: 3 }), 'Enum() have to build its keyToValue lookup table correctly')
    assert(utils.objectEqual(t2_keyToValue, { red: 'red', green: 'green', blue: 'blue' }), 'Enum() have to build its keyToValue lookup table correctly')
    assert(utils.objectEqual(t_keyToNumber, { red: 1, green: 2, blue: 4 }), 'Enum() have to build its keyToNumber lookup table correctly')
    assert(utils.objectEqual(t2_keyToNumber, { red: 1, green: 2, blue: 4 }), 'Enum() have to build its keyToNumber lookup table correctly')

    assert(utils.objectEqual(t_valueToKey, { '1': 'red', '2': 'green', '3': 'blue' }), 'Enum() have to build its valueToKey lookup table correctly')
    assert(utils.objectEqual(t2_valueToKey, { red: 'red', green: 'green', blue: 'blue' }), 'Enum() have to build its valueToKey lookup table correctly')
    assert(utils.objectEqual(t_valueToNumber, { '1': 1, '2': 2, '3': 4 }), 'Enum() have to build its valueToNumber lookup table correctly')
    assert(utils.objectEqual(t2_valueToNumber, { red: 1, green: 2, blue: 4 }), 'Enum() have to build its valueToNumber lookup table correctly')

    assert(utils.objectEqual(t_numberToKey, { '1': 'red', '2': 'green', '4': 'blue' }), 'Enum() have to build its numberToKey lookup table correctly')
    assert(utils.objectEqual(t2_numberToKey, { '1': 'red', '2': 'green', '4': 'blue' }), 'Enum() have to build its numberToKey lookup table correctly')
    assert(utils.objectEqual(t_numberToValue, { '1': 1, '2': 2, '4': 3 }), 'Enum() have to build its numberToValue lookup table correctly')
    assert(utils.objectEqual(t2_numberToValue, { '1': 'red', '2': 'green', '4': 'blue' }), 'Enum() have to build its numberToValue lookup table correctly')

    // Enum().length

    assert('length' in test, 'Enum().length must be exposed')
    assert.equal(test.length, 3, 'Enum().length must be correct')

    // Enum().valuesOf()

    assert('valuesOf' in test, 'Enum().valuesOf() must be exposed')
    assert(test.valuesOf instanceof Function, 'Enum().valuesOf() must be a function')
    assert(utils.arrayEqual(test.valuesOf(item), [ 1, 3 ]), 'Enum().valuesOf() must return correct values')
    assert(utils.arrayEqual(test2.valuesOf(item), [ 'red', 'blue' ]), 'Enum().valuesOf() must return correct values')

    // Enum().keysOf()

    assert('keysOf' in test, 'Enum().keysOf() must be exposed')
    assert(test.keysOf instanceof Function, 'Enum().keysOf() must be a function')
    assert(utils.arrayEqual(test.keysOf(item), [ 'red', 'blue' ]), 'Enum().keysOf() must return correct values')
    assert(utils.arrayEqual(test2.keysOf(item), [ 'red', 'blue' ]), 'Enum().keysOf() must return correct values')

    // Enum().valueOf()

    assert('valueOf' in test, 'Enum().valueOf() must be exposed')
    assert(test.valueOf instanceof Function, 'Enum().valueOf() must be a function')
    assert.equal(test.valueOf(item), 1, 'Enum().valueOf() must return a correct value')
    assert.equal(test2.valueOf(item), 'red', 'Enum().valueOf() must return a correct value')

    // Enum().keyOf()

    assert('keyOf' in test, 'Enum().keyOf() must be exposed')
    assert(test.keyOf instanceof Function, 'Enum().keyOf() must be a function')
    assert.equal(test.keyOf(item), 'red', 'Enum().keyOf() must return a correct value')
    assert.equal(test2.keyOf(item), 'red', 'Enum().keyOf() must return a correct value')

    // Enum().valueByKey()

    assert('valueByKey' in test, 'Enum().valueByKey() must be exposed')
    assert(test.valueByKey instanceof Function, 'Enum().valueByKey() must be a function')
    assert.equal(test.valueByKey('green'), 2, 'Enum().valueByKey() must return a correct value')
    assert.equal(test2.valueByKey('blue'), 'blue', 'Enum().valueByKey() must return a correct value')

    // Enum().keyByValue()

    assert('keyByValue' in test, 'Enum().keyByValue() must be exposed')
    assert(test.keyByValue instanceof Function, 'Enum().keyByValue() must be a function')
    assert.equal(test.keyByValue(2), 'green', 'Enum().keyByValue() must return a correct value')
    assert.equal(test2.keyByValue('blue'), 'blue', 'Enum().keyByValue() must return a correct value')

    // Enum().valuesByKeys()

    assert('valuesByKeys' in test, 'Enum().valuesByKeys() must be exposed')
    assert(test.valuesByKeys instanceof Function, 'Enum().valuesByKeys() must be a function')
    assert(utils.arrayEqual(test.valuesByKeys('red', 'green'), [ 1, 2 ]), 'Enum().valuesByKeys() must return correct values')
    assert(utils.arrayEqual(test.valuesByKeys([ 'red', 'green' ]), [ 1, 2 ]), 'Enum().valuesByKeys() must return correct values')
    assert(utils.arrayEqual(test2.valuesByKeys('red', 'green'), [ 'red', 'green' ]), 'Enum().valuesByKeys() must return correct values')
    assert(utils.arrayEqual(test2.valuesByKeys([ 'red', 'green' ]), [ 'red', 'green' ]), 'Enum().valuesByKeys() must return correct values')

    // Enum().keysByValues()

    assert('keysByValues' in test, 'Enum().keysByValues() must be exposed')
    assert(test.keysByValues instanceof Function, 'Enum().keysByValues() must be a function')
    assert(utils.arrayEqual(test.keysByValues(1, 2), [ 'red', 'green' ]), 'Enum().keysByValues() must return correct values')
    assert(utils.arrayEqual(test.keysByValues([ 1, 2 ]), [ 'red', 'green' ]), 'Enum().keysByValues() must return correct values')
    assert(utils.arrayEqual(test2.keysByValues([ 'red', 'green' ]), [ 'red', 'green' ]), 'Enum().keysByValues() must return correct values')

    // Enum().fromValue()

    assert('fromValue' in test, 'Enum().fromValue() must be exposed')
    assert(test.fromValue instanceof Function, 'Enum().fromValue() must be a function')
    assert.equal(test.fromValue(2), test.green, 'Enum().fromValue() must return a correct value')
    assert.equal(test2.fromValue('red'), test2.red, 'Enum().fromValue() must return a correct value')

    // Enum().fromValues()

    assert('fromValues' in test, 'Enum().fromValues() must be a function')
    assert(test.fromValues instanceof Function, 'Enum().fromValues() must be a function')
    assert.equal(test.fromValues(1, 2), test.red | test.green, 'Enum().fromValues() must return correct values')
    assert.equal(test.fromValues([ 1, 2 ]), test.red | test.green, 'Enum().fromValues() must return correct values')
    assert.equal(test2.fromValues([ 'red', 'green' ]), test2.red | test2.green, 'Enum().fromValues() must return correct values')

    var arr = [ 2, 3 ]

    assert(utils.arrayEqual(test.valuesOf(test.fromValues(arr)), arr))

    // Enum().item() and Enum().item().in()

    assert('item' in test, 'Enum().item() must be exposed')
    assert(test.item instanceof Function, 'Enum().item() must be a function')

    item = test.item('green')

    assert(item instanceof Object, 'Enum().item() must return an object')
    assert('in' in item && item['in'] instanceof Function, 'return value of Enum().item() must have a method called "in"')
    assert('key' in item, 'return value of Enum().item() must have a member called "key"')
    assert('value' in item, 'return value of Enum().item() must have a member called "value"')

    assert(item['in'](test.green), 'Enum().item(test.green).in(test.green) must return true')
    assert(!item['in'](test.red), 'Enum().item(test.green).in(test.red) must return false')
    assert(item['in'](test.red | test.green), 'Enum().item(test.green).in(test.red | test.green) must return true')
    assert(!item['in'](test.red | test.blue), 'Enum().item(test.green).in(test.red | test.blue) must return false')

    item = test.item(1)

    assert(item['in'](test.green), 'Enum().item(test.green).in(test.green) must return true')
    assert(!item['in'](test.red), 'Enum().item(test.green).in(test.red) must return false')
    assert(item['in'](test.red | test.green), 'Enum().item(test.green).in(test.red | test.green) must return true')
    assert(!item['in'](test.red | test.blue), 'Enum().item(test.green).in(test.red | test.blue) must return false')

    item = test.item('fake')

    assert(!item['in'](test.green), 'Enum().item(#).in(test.green) must return false')
    assert(!item['in'](test.red), 'Enum().item(#).in(test.red) must return false')
    assert(!item['in'](test.red | test.green), 'Enum().item(#).in(test.red | test.green) must return false')
    assert(!item['in'](test.red | test.blue), 'Enum().item(#).in(test.red | test.blue) must return false')

    // Enum().get()

    assert('get' in test, 'Enum().get() must be exposed')
    assert(test.get instanceof Function, 'Enum().get() must be a function')

    item = test.get('green')

    assert(item instanceof Object, 'Enum().get(test.green) must return an object')
    assert('key' in item, 'return value of Enum().get(test.green) must have a member called "key"')
    assert('value' in item, 'return value of Enum().get(test.green) must have a member called "value"')
    assert.equal(item.key, 'green', 'Enum().get(test.green).key must be correct')
    assert.equal(item.value, 2, 'Enum().get(test.green).value must be correct')

    item = test.get(2)

    assert(item instanceof Object, 'Enum().get() must return an object')
    assert('key' in item, 'return value of Enum().get(2) must have a member called "key"')
    assert('value' in item, 'return value of Enum().get(2) must have a member called "value"')
    assert.equal(item.key, 'blue', 'Enum().get(2).key must be correct')
    assert.equal(item.value, 3, 'Enum().get(2).value must be correct')

    item = test.get('fake')

    assert.equal(item, null, 'Enum().get(#) must return null')

    // Enum().fromKey()

    assert('fromKey' in test, 'Enum().fromKey() must be exposed')
    assert(test.fromKey instanceof Function, 'Enum().fromKey() must be a function')
    assert.equal(test.fromKey('blue'), test.blue, 'Enum().fromKey() must return a correct value')
    assert.equal(test2.fromKey('green'), test.green, 'Enum().fromKey() must return a correct value')

    // Enum().fromKeys()

    assert('fromKeys' in test, 'Enum().fromKeys() must be exposed')
    assert(test.fromKeys instanceof Function, 'Enum().fromKeys() must be a function')
    assert.equal(test.fromKeys('blue', 'red'), test.blue | test.red, 'Enum().fromKeys() must return correct values')
    assert.equal(test.fromKeys([ 'blue', 'red' ]), test.blue | test.red, 'Enum().fromKeys() must return correct values')
    assert.equal(test2.fromKeys('green', 'blue'), test.green | test.blue, 'Enum().fromKeys() must return correct values')
    assert.equal(test2.fromKeys([ 'green', 'blue' ]), test.green | test.blue, 'Enum().fromKeys() must return correct values')

    // Enum().fromJSON()

    assert('fromJSON' in test, 'Enum().fromJSON() must be exposed')
    assert(test.fromJSON instanceof Function, 'Enum().fromJSON() must be a function')
    assert.equal(test.fromJSON('[1,2]'), test.red | test.green, 'Enum().fromJSON() must return a correct value')
    assert.equal(test.fromJSON([ 1, 3 ]), test.red | test.blue, 'Enum().fromJSON() must return a correct value')
    assert.equal(test2.fromJSON('["red","green"]'), test.red | test.green, 'Enum().fromJSON() must return a correct value')
    assert.equal(test2.fromJSON([ 'red', 'blue' ]), test.red | test.blue, 'Enum().fromJSON() must return a correct value')

    assert(utils.objectEqual(Enum.fromJSON(JSON.stringify(test)), test))

    // Enum().toJSON()

    assert('toJSON' in test, 'Enum().toJSON() must be exposed')
    assert(test.toJSON instanceof Function, 'Enum().toJSON() must be a function')
    assert(utils.objectEqual(test.toJSON(), { red: 1, green: 2, blue: 3 }), 'Enum().toJSON() must return a correct value')
    assert(utils.objectEqual(test2.toJSON(), { red: 'red', green: 'green', blue: 'blue' }), 'Enum().toJSON() must return a correct value')
    assert(utils.arrayEqual(test.toJSON(test.red | test.green), [ 1, 2 ]), 'Enum().toJSON() must return a correct value')
    assert(utils.arrayEqual(test2.toJSON(test.blue), [ 'blue' ]), 'Enum().toJSON() must return a correct value')

    // JSON.stringify

    assert.equal(JSON.stringify(test.toJSON()), '{"red":1,"green":2,"blue":3}', 'JSON.stringify(Enum().toJSON()) must return a correct value')
    assert.equal(JSON.stringify(test2.toJSON()), '{"red":"red","green":"green","blue":"blue"}', 'JSON.stringify(Enum().toJSON()) must return a correct value')
    assert.equal(JSON.stringify(test.toJSON(test.red | test.green)), '[1,2]', 'JSON.stringify(Enum().toJSON()) must return a correct value')
    assert.equal(JSON.stringify(test2.toJSON(test.blue)), '["blue"]', 'JSON.stringify(Enum().toJSON()) must return a correct value')

    // Enum().switch()

    test['switch'](test.red | test.blue)
        ['case']('red', function (value) {
            st1 = value
        })
        ['case'](test.green, function (value) {
            st2 = value
        })
        ['case'](test.blue, function (value) {
            st3 = value
        })

    assert(st1 === 1 && !st2 && st3 === 3, 'Enum().switch().case() chain call must invoke the correct case action functions with correct values')

    resetST()

    test2
        ['switch'](test.red | test.blue)

        ['case']('red', function (value) {
            st1 = value
        })

        ['case'](test.green, function (value) {
            st2 = value
        })

        ['case'](test.blue, function (value) {
            st3 = value
        })

    assert(st1 === 'red' && !st2 && st3 === 'blue', 'Enum().switch().case() chain call must invoke the correct case action functions with correct values')

    resetST()

    test['switch'](test.green)
        ['case']('red', function (value) {
            st1 = value
        })
        ['case'](test.green, function (value) {
            st2 = value
        })

    assert(!st1 && st2 === 2, 'Enum().switch().case() chain call must invoke the correct case action functions with correct values')

    resetST()

    // Enum().keys

    assert('keys' in test, 'Enum().keys must be exposed')
    assert(utils.arrayEqual(test.keys, [ 'red', 'green', 'blue' ]), 'Enum().keys must be correct')
    assert(utils.arrayEqual(test.keys, [ 'red', 'green', 'blue' ]), 'Enum().keys must be correct')

    // Enum().values

    assert('values' in test, 'Enum().values must be exposed')
    assert(utils.arrayEqual(test.values, [ 1, 2, 3 ]), 'Enum().values must be correct')
    assert(utils.arrayEqual(test2.values, [ 'red', 'green', 'blue' ]), 'Enum().values must be correct')

    // Enum().items

    assert('items' in test, 'Enum().items must be exposed')
    assert(utils.arrayDeepEqual(test.items, [ { key: 'red', value: 1 }, { key: 'green', value: 2 }, { key: 'blue', value: 3 } ]), 'Enum().items must be correct')
    assert(utils.arrayDeepEqual(test2.items, [ { key: 'red', value: 'red' }, { key: 'green', value: 'green' }, { key: 'blue', value: 'blue' } ]), 'Enum().items must be correct')

    // Enum().inspect()

    var testInspectedText = '\
Enum({\n\
    "red": 1,\n\
    "green": 2,\n\
    "blue": 3\n\
})'

    var test2InspectedText = '\
Enum({\n\
    "red": "red",\n\
    "green": "green",\n\
    "blue": "blue"\n\
})'

    assert('inspect' in test, 'Enum().inspect() must be exposed')
    assert(test.inspect instanceof Function, 'Enum().inspect() must be a function')
    assert.equal(test.inspect(), testInspectedText, 'return value of Enum().inspect() must be correct')
    assert.equal(test2.inspect(), test2InspectedText, 'return value of Enum().inspect() must be correct')

    // Enum().toString()

    assert.equal(test.toString(), '[object Enum]', 'Enum().toString() must return "[object Enum]"')

    /* - primitive values - */

    // bools

    var bools = new Enum(true, false)

    assert.equal(bools.valueOf(bools['true']), true, 'bool values are allowed to be used as items')
    assert(utils.objectEqual(bools.toJSON(), { 'true': true, 'false': false }), 'bool values are allowed to be used as items')

    // numbers

    var nums = Enum(1, 2, 3, 4, 5, 6, 7, 8, 9)

    assert.equal(nums.valueOf(nums[2]), 2, 'number values are allowed to be used as items')
    assert(utils.objectEqual(nums.toJSON(), { "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9 }), 'number values are allowed to be used as items')

    /* - not flaggable - */

    var states = Enum('pending', 'processing', 'finished', 'failed', { single: true })

    assert.equal(states.valueOf(states.processing), 'processing')

    assert.throws(function () {
        states.valueOf(states.processing | states.pending)
    })

    assert.throws(function () {
        states.keyOf(states.processing | states.pending)
    })

    assert.throws(function () {
        states.valuesOf(states.processing | states.pending)
    })

    assert.throws(function () {
        states.keysOf(states.processing | states.pending)
    })

    assert.throws(function () {
        states.fromValues('processing', 'pending')
    })

    assert.throws(function () {
        states.fromKeys('processing', 'pending')
    })

    /* - ignore case - */

    var caseSensitiveNames = [ 'IteM1', 'iTEm2', 'ITEM3', 'item4' ],
        ctest              = Enum(caseSensitiveNames, { ignoreCase: true }),
        ctest2             = Enum(caseSensitiveNames, { single: true })

    assert(utils.objectEqual(ctest.get('item2'), { key: 'item2', value: 'iTEm2' }), 'case must be ignored if ignoreCase options is set to true')
    assert(utils.objectEqual(ctest.get('itEM2'), { key: 'item2', value: 'iTEm2' }), 'case must be ignored if ignoreCase options is set to true')
    assert.equal(ctest.valueByKey('item2'), 'iTEm2', 'case must be ignored if ignoreCase options is set to true')
    assert(utils.arrayEqual(ctest.valuesByKeys('item2', 'iteM3', 'iTem4'), [ 'iTEm2', 'ITEM3', 'item4' ]), 'case must be ignored if ignoreCase options is set to true')
    assert.equal(ctest2.get('item2'), null, 'case must be ignored if ignoreCase options is set to true')
    assert(utils.objectEqual(ctest2.get('iTEm2'), { key: 'iTEm2', value: 'iTEm2' }), 'case must be ignored if ignoreCase options is set to true')
    assert.equal(ctest2.fromKey('iteM2'), ctest2.item2, 'case must be ignored if ignoreCase options is set to true')
    assert.equal(ctest.fromKeys('iteM2', 'ItEm1'), ctest2.item1 | ctest2.item2, 'case must be ignored if ignoreCase options is set to true')

    /* - options - */

    var optsKey     = names ? names['opts'] : 'opts',
        test_opts   = test._[optsKey],
        ctest_opts  = ctest._[optsKey],
        ctest2_opts = ctest2._[optsKey]

    assert(utils.objectEqual(test_opts, { ignoreCase: false, single: false }), 'internal options object must be set up correctly')
    assert(utils.objectEqual(ctest_opts, { ignoreCase: true, single: false }), 'internal options object must be set up correctly')
    assert(utils.objectEqual(ctest2_opts, { ignoreCase: false, single: true }), 'internal options object must be set up correctly')

    var bothOptsTest = Enum(1, { ignoreCase: true, single: true }),
        bothOptsTest_opts = bothOptsTest._.opts || bothOptsTest._[optsKey]

    assert(utils.objectEqual(bothOptsTest_opts, { ignoreCase: true, single: true }), 'internal options object must be set up correctly')

    /* - comparisons - */

    var foodList = [ 'pizza', 'hamburger', 'macaroni', 'ketchup' ],
        food     = Enum(foodList)

    var dinner = food.pizza | food.ketchup

    assert(dinner === food.ketchup | food.pizza)
    assert(dinner !== food.ketchup | food.hamburger)
    assert(dinner !== food.pizza)

    var food2 = Enum('pizza', 'hamburger', 'macaroni', 'ketchup')

    assert(food != food2)

    assert(food.pizza === food2.pizza)

    assert(food instanceof Enum)
    assert(!(food.pizza instanceof Enum))
    assert(typeof food === 'object')
    assert(typeof food.pizza === 'number')

    /* - operations - */

    item = test.red | test.green

    item |= test.blue

    assert(utils.arrayEqual(test.keysOf(item), [ 'red', 'green', 'blue' ]), '|= operator must extend the value')

    item ^= test.green

    assert(utils.arrayEqual(test.valuesOf(item), [ 1, 3 ]), '^= operator must curtail the value')

    item ^= test.red | test.blue

    assert(utils.arrayEqual(test.valuesOf(item), []), '^= operator combined with | operator must curtail the value')

    /* - capacity - */

    // correct case

    var descriptor = [],
        value      = 0

    for(var i = 0; i < Enum.MAX_LENGTH; i++)
        descriptor.push(i)

    var max = new Enum(descriptor)

    for(i = 0; i < Enum.MAX_LENGTH; i++)
        value |= max[ i ] // add all the possible flags

    assert(utils.arrayEqual(max.valuesOf(value), descriptor))

    // incorrect case

    descriptor[ Enum.MAX_LENGTH ] = Enum.MAX_LENGTH

    assert.throws(function () { new Enum(descriptor) }, 'Enum constructor must validate item count')

    value |= max[ Enum.MAX_LENGTH ]

    assert(!utils.arrayEqual(max.valuesOf(value), descriptor), 'Items over enum\'s capacity must be ignored.')

    // print results

    if('window' in ctx) {
        document.write('<br/><b style="color: green">' + passed + ' tests passed successfully</b><br/>')

        var failed = all - passed

        if(failed)
            document.write('<b style="color: red">' + failed + ' tests failed</b>')
    }
    else
        console.log(passed + ' unit tests passed successfully')
}

if('window' in ctx)
    // load mapping table of mangled names and then run tests if we're in a browser
    $.get('mangled.json').then(doGlobalTest)
else
    // just run the tests otherwise
    doGlobalTest()