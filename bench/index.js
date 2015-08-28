/**
 * Created by schwarzkopfb on 15/8/21.
 */

/*

    Here you can find a measurement for one member of each important Enum instance method family.
    Run this file if you're curious about the results on your machine.

 */

var ITERATIONS = +process.argv[2] || 50000000

var Enum      = require('../enumerated'),
    test      = Enum(1, 2, 3, 4, 5, 6, 7, 8),
    timestamp = +new Date,
    i         = ITERATIONS

function rand() {
    return Math.round(Math.random() * 255)
}

function snapshot(name) {
    var d = ((+new Date - timestamp) / 1000).toFixed(2)
    console.log(ITERATIONS + ' ' + name + ' calls performed in ' + d + ' seconds (' + (ITERATIONS / d).toFixed(2) + ' ops/sec)')
    i = ITERATIONS
    timestamp = +new Date
}

// get()

while(--i)
    test.get(2)

snapshot('get()')

// valueOf()

while(--i)
    test.valueOf(rand())

snapshot('valueOf()')

// valuesOf()

while(--i)
    test.valuesOf(rand())

snapshot('valuesOf()')

// slower methods coming, it's time to reduce iteration count...

while(ITERATIONS > 1000000)
    ITERATIONS = Math.round(ITERATIONS / 50)

i = ITERATIONS

// fromValues()

while(--i)
    test.fromValues(1, 4, 5, 2)

snapshot('fromValues()')

// valuesByKeys()

while(--i)
    test.valuesByKeys(1, 4, 5, 2)

snapshot('valuesByKeys()')

// ...and it's time again

i = ITERATIONS = 100000

// constructor call

while(--i)
    test = Enum(1, 2, 3, 4, 5, 6, 7, 8)

snapshot('constructor')