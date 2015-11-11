/**
 * Created by schwarzkopfb on 15/10/23.
 */

function valueOfNumber(num) {
    return Number.prototype.valueOf.call(num)
}

function Enum(descriptor) {
    var keys = Object.keys(descriptor),
        n    = 1

    for(var key in descriptor) {
        if(!descriptor.hasOwnProperty(key)) continue;

        EnumInstance[ key ] = toEnumItem.call(n, EnumInstance, key, descriptor[ key ])
        n *= 2
    }

    function EnumInstance(items) {
        if(!(items instanceof EnumItem)) {
            var num = items
            items = []

            for(var i = 0, l = keys.length, n = 1; i < l; i++, n *= 2)
                if(n & num)
                    items.push(EnumInstance[ keys[ i ] ])
        }
        else if(!Array.isArray(items))
            items = Array.prototype.slice.call(arguments)

        return enumify(EnumInstance, items)
    }

    EnumInstance.__proto__ = Enum.prototype

    return EnumInstance
}

function EnumItem(owner, key, value) {
    return toEnumItem(owner, key, value)
}

function toEnumItem(owner, key, value) {
    var num = valueOfNumber(this)

    this.__proto__ = EnumItem.prototype

    Object.defineProperties(this, {
        owner: {
            get: function () {
                return owner
            }
        },

        key: {
            get: function () {
                return key
            }
        },

        value: {
            get: function () {
                return value
            }
        },

        valueOf: {
            value: function () {
                return num
            }
        },

        inspect: {
            value: function () {
                if(Array.isArray(key))
                    return 'EnumItem { ' + key.map(function (key, i) {
                            return key + ': ' + value[ i ]
                        }).join(', ') + ' }'
                else
                    return 'EnumItem { ' + key + ': ' + value + ' }'
            }
        }
    })

    return this
}

function extendArray(arr, items) {
    if(Array.isArray(items)) {
        items.forEach(function (item) {
            if(!~arr.indexOf(item))
                arr.push(item)
        })
    }
    else if(!~arr.indexOf(items))
        arr.push(items)
}

function enumify(owner, items) {
    var n      = 0,
        keys   = [],
        values = []

    for(var i = 0, l = items.length; i < l; i++) {
        var item = items[ i ]

        if(item instanceof EnumItem) {
            n |= item

            extendArray(keys,   item.key)
            extendArray(values, item.value)
        }
    }

    if(n)
        return toEnumItem.call(n, owner, keys, values)
    else
        return null
}

Number.prototype.enum = function (owner) {
    if(owner instanceof EnumItem)
        owner = owner.owner

    if(owner instanceof Enum)
        return owner(this)
    else
        throw Error('You must pass an Enum instance to get items represented by a number.')
}

Number.prototype.key = function (owner) {
    return this.enum(owner).key
}

Number.prototype.value = function (owner) {
    return this.enum(owner).value
}

var test  = new Enum({ a: 1, b: 2, c: 3 }),
    test2 = test.a | test.c,
    test3 = test.b | test.a

console.log(test.a.value)
console.log(test(test2))
console.log((test2 | test3).enum(test))
