/**
 * Created by schwarzkopfb on 15/8/19.
 */

// todo: write unit tests based on the code above

//var Enum = require('../enumerated')
require('../enumerated').global = true

var colors         = Enum([ 'red', 'green', 'blue' ], { single: true }),
    selectedColors = colors.red// | colors.blue

console.log(colors)
console.log(colors.length)
console.log(colors.valuesOf(selectedColors))
console.log(colors.keysOf(selectedColors))

console.log(colors.get(1))

console.log("=============================")

var numbers = new Enum({
    one:   1,
    two:   2,
    three: 3,
    four:  4,
    five:  5
})

var selectedNumbers = numbers.one | numbers.three | numbers.five,
    json = numbers.toJSON(selectedNumbers)

console.log(numbers)
console.log(numbers.toString())
console.log(json)
console.log(numbers.valuesOf(numbers.fromJSON(json)))
console.log(numbers.length)
console.log(numbers.valueOf(selectedNumbers))
console.log(numbers.valuesOf(selectedNumbers))
console.log(numbers.keysOf(selectedNumbers))
console.log(numbers.keyByValue(5))
console.log(numbers.valueByKey('four'))
console.log(numbers.valuesByKeys([ 'two', 'four' ]))
console.log(numbers.keysByValues(2, 4))
console.log(numbers.keys)
console.log(numbers.values)
console.log(numbers.items)
console.log(JSON.stringify(numbers))
console.log(Enum.fromJSON(JSON.stringify(numbers)))
console.log(Enum.item(numbers.three).in(selectedNumbers))
console.log(Enum.item(numbers.two).in(selectedNumbers))
console.log('two in two', Enum.item(numbers.two).in(numbers.two))
console.log('two in three', Enum.item(numbers.two).in(numbers.three))
console.log(numbers.item('three').in(selectedNumbers))
console.log(numbers.item('two').in(selectedNumbers))
console.log(numbers.item('fake').in(selectedNumbers))
console.log(numbers instanceof Enum)
console.log(typeof numbers)
console.log(typeof numbers.one)

console.log('single',   Enum.item(numbers.five).isSingle())
console.log('multiple', Enum.item(numbers.five).isMultiple())
console.log('multiple', Enum.item(numbers.five | numbers.four).isMultiple())

console.log("=============================")

/// ignore case

var caseSensitiveNames = [ 'IteM1', 'iTEm2', 'ITEM3', 'item4' ],
    caseTest1 = Enum(caseSensitiveNames, { ignoreCase: true }),
    caseTest2 = Enum(caseSensitiveNames)

console.log(caseTest1.get('item2'))
console.log(caseTest1.get('itEM2'))
console.log(caseTest1.valueByKey('item2'))
console.log(caseTest1.valuesByKeys('item2', 'iteM3', 'iTem4'))
console.log(caseTest2.get('item2'))
console.log(caseTest2.get('iTEm2'))

console.log("=============================")

/// primitive values

// bools

var bools = new Enum(true, false)

var selectedBools = bools.true

console.log(bools.valueOf(selectedBools))
console.log(bools.toJSON(selectedBools))
console.log(bools.keyOf(selectedBools))

// numbers

var nums = Enum(1, 2, 3, 4, 5, 6, 7, 8, 9)

console.log(nums)

/// automated maximum test

// correct case

var descriptor = [],
    value      = 0

for(var i = 0; i < Enum.MAX_LENGTH; i++)
    descriptor.push(i)

var max = new Enum(descriptor)

for(i = 0; i < Enum.MAX_LENGTH; i++)
    value |= max[ i ] // add all the possible flags

console.log(max.valuesOf(value))

// incorrect case

try {
    descriptor[ Enum.MAX_LENGTH ] = Enum.MAX_LENGTH

    max = new Enum(descriptor)

    value |= max[ Enum.MAX_LENGTH ]

    console.log(max.valuesOf(value))
}
catch(ex) {}

// Enum.MAX_LENGTH is read only

Enum.MAX_LENGTH = 111
console.log(Enum.MAX_LENGTH)